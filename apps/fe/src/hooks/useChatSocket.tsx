'use client';

import {
  CHAT_WS_EVENTS,
  CHAT_WS_PATH,
  type ChatMessageInfo,
  type ChatWsMembershipPayload,
  type ChatWsReadPayload,
  type ChatWsTypingPayload,
} from '@repo/types';
import type { InfiniteData } from '@tanstack/react-query';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { env, queryKey } from '@/configs';
import { loadAuthSession } from '@/utils/storage';

export type ChatConnStatus = 'idle' | 'connecting' | 'open' | 'closed' | 'error';
export type LocalSendStatus = 'sending' | 'failed';
export type LocalChatMessage = ChatMessageInfo & { sendStatus?: LocalSendStatus };
export type MessagesCache = InfiniteData<{ data: LocalChatMessage[]; nextCursor: number | null }>;

type TypingEntry = { userId: string; fullName?: string; expiresAt: number };

type ChatSocketValue = {
  status: ChatConnStatus;
  authed: boolean;
  userId: string | null;
  subscribe: (conversationId: string) => void;
  unsubscribe: (conversationId: string) => void;
  sendMessage: (
    conversationId: string,
    body: string,
    options?: { isUrgent?: boolean },
  ) => string | null;
  retryMessage: (conversationId: string, clientMessageId: string) => void;
  sendTyping: (conversationId: string, isTyping: boolean) => void;
  sendRead: (conversationId: string, seq: number) => void;
  reconnect: () => void;
  typing: Record<string, TypingEntry[]>;
  peerReads: Record<string, { userId: string; seq: number }>;
};

const ChatSocketContext = createContext<ChatSocketValue | null>(null);

const ACK_TIMEOUT_MS = 12_000;
const TYPING_LOCAL_TTL_MS = 8_000;
const MAX_BACKOFF_MS = 30_000;

function wsUrl() {
  return `${env.NEXT_PUBLIC_BACKEND_URL.replace(/^http/, 'ws')}${CHAT_WS_PATH}`;
}

function readToken() {
  return loadAuthSession()?.accessToken ?? null;
}

interface ChatTokenClaims {
  id?: string;
  fullName?: string;
  companyId?: string | null;
  companyMemberId?: string | null;
  workspaceType?: 'personal' | 'company';
  role?: string;
  companyRole?: string;
}

export function parseTokenClaims(token: string | null): ChatTokenClaims | null {
  if (!token) return null;
  try {
    const payload = token.split('.')[1];
    if (!payload) return null;
    return JSON.parse(atob(payload)) as ChatTokenClaims;
  } catch {
    return null;
  }
}

export function hasCompanyChatContext(token: string | null): boolean {
  const claims = parseTokenClaims(token);
  if (!claims) return false;
  if (claims.workspaceType === 'personal') return false;
  return Boolean(claims.companyId && claims.companyMemberId);
}

export function ChatSocketProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const [status, setStatus] = useState<ChatConnStatus>('idle');
  const [authed, setAuthed] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [typing, setTyping] = useState<Record<string, TypingEntry[]>>({});
  const [peerReads, setPeerReads] = useState<Record<string, { userId: string; seq: number }>>({});

  const wsRef = useRef<WebSocket | null>(null);
  const subsRef = useRef<Set<string>>(new Set());
  const attemptsRef = useRef(0);
  const retryTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const ackTimersRef = useRef(new Map<string, ReturnType<typeof setTimeout>>());
  const mountedRef = useRef(true);
  const fullNameRef = useRef<string | undefined>(undefined);

  const clearRetry = () => {
    if (retryTimerRef.current) clearTimeout(retryTimerRef.current);
    retryTimerRef.current = null;
  };

  const appendMessage = useCallback(
    (conversationId: string, msg: LocalChatMessage) => {
      const key = queryKey.chat.messages(conversationId);
      queryClient.setQueryData<MessagesCache>(key, (old) => {
        if (!old) return old;
        let replaced = false;
        const pages = old.pages.map((page) => ({
          ...page,
          data: page.data.map((m) => {
            if (
              m.id === msg.id ||
              (msg.clientMessageId && m.clientMessageId === msg.clientMessageId)
            ) {
              replaced = true;
              return msg;
            }
            return m;
          }),
        }));
        if (replaced) return { ...old, pages };
        const last = pages[pages.length - 1];
        const next = [...pages];
        next[next.length - 1] = { ...last, data: [...last.data, msg] };
        return { ...old, pages: next };
      });
    },
    [queryClient],
  );

  const dispatch = useCallback(
    (raw: unknown) => {
      let msg: { event?: unknown; reqId?: unknown; payload?: unknown };
      try {
        msg = typeof raw === 'string' ? (JSON.parse(raw) as typeof msg) : (raw as typeof msg);
      } catch {
        return;
      }
      if (!msg || typeof msg.event !== 'string') return;
      const payload = (msg.payload ?? {}) as Record<string, any>;

      switch (msg.event) {
        case CHAT_WS_EVENTS.AUTH_OK: {
          attemptsRef.current = 0;
          setAuthed(true);
          setStatus('open');
          setUserId(payload?.user?.id ?? null);
          fullNameRef.current = payload?.user?.fullName;
          for (const id of subsRef.current) {
            wsRef.current?.send(
              JSON.stringify({ event: CHAT_WS_EVENTS.SUBSCRIBE, payload: { conversationId: id } }),
            );
          }
          for (const id of subsRef.current) {
            void queryClient.invalidateQueries({ queryKey: queryKey.chat.messages(id) });
          }
          void queryClient.invalidateQueries({ queryKey: queryKey.chatRoot() });
          return;
        }
        case CHAT_WS_EVENTS.NEW: {
          const message = payload?.message as ChatMessageInfo | undefined;
          if (!message?.conversationId || !message?.id) return;
          appendMessage(message.conversationId, message);
          void queryClient.invalidateQueries({ queryKey: queryKey.chat.conversations() });
          return;
        }
        case CHAT_WS_EVENTS.ACK: {
          const message = payload?.message as ChatMessageInfo | undefined;
          const cmid = payload?.clientMessageId as string | undefined;
          if (!message?.conversationId || !message?.id) return;
          const timer = cmid ? ackTimersRef.current.get(cmid) : undefined;
          if (timer) {
            clearTimeout(timer);
            if (cmid) ackTimersRef.current.delete(cmid);
          }
          appendMessage(message.conversationId, message);
          void queryClient.invalidateQueries({ queryKey: queryKey.chat.conversations() });
          return;
        }
        case CHAT_WS_EVENTS.DELIVERED: {
          const message = payload?.message as ChatMessageInfo | undefined;
          if (!message?.conversationId || !message?.id) return;
          appendMessage(message.conversationId, message);
          void queryClient.invalidateQueries({ queryKey: queryKey.chat.conversations() });
          return;
        }
        case CHAT_WS_EVENTS.CONVERSATION_UPDATED: {
          void queryClient.invalidateQueries({ queryKey: queryKey.chat.conversations() });
          return;
        }
        case CHAT_WS_EVENTS.MEMBERSHIP_CHANGED: {
          const p = payload as Partial<ChatWsMembershipPayload>;
          void queryClient.invalidateQueries({ queryKey: queryKey.chatRoot() });
          if (p.conversationId) {
            void queryClient.invalidateQueries({
              queryKey: queryKey.chat.members(p.conversationId),
            });
          }
          return;
        }
        case CHAT_WS_EVENTS.TYPING_UPDATE: {
          const p = payload as Partial<ChatWsTypingPayload> & { conversationId?: string };
          if (!p.conversationId || !p.userId) return;
          if (p.userId === userIdRef.current) return;
          setTyping((prev) => {
            const list = (prev[p.conversationId as string] ?? []).filter(
              (t) => t.userId !== p.userId,
            );
            if (p.isTyping) {
              list.push({
                userId: p.userId as string,
                fullName: p.fullName,
                expiresAt: Date.now() + TYPING_LOCAL_TTL_MS,
              });
            }
            return { ...prev, [p.conversationId as string]: list };
          });
          return;
        }
        case CHAT_WS_EVENTS.READ: {
          const p = payload as Partial<ChatWsReadPayload> & { conversationId?: string };
          if (!p.conversationId || !p.userId || typeof p.seq !== 'number') return;
          if (p.userId === userIdRef.current) return;
          setPeerReads((prev) => {
            const cur = prev[p.conversationId as string];
            if (cur && cur.seq >= (p.seq as number)) return prev;
            return {
              ...prev,
              [p.conversationId as string]: { userId: p.userId as string, seq: p.seq as number },
            };
          });
          return;
        }
        case CHAT_WS_EVENTS.ERROR: {
          if (payload?.code === 'AUTH_FAILED') {
            const fresh = readToken();
            if (fresh && fresh !== tokenRef.current && hasCompanyChatContext(fresh)) {
              tokenRef.current = fresh;
              wsRef.current?.send(
                JSON.stringify({ event: CHAT_WS_EVENTS.AUTH, payload: { token: fresh } }),
              );
              return;
            }
            // Secondary websocket auth failure must NEVER wipe app session
            setAuthed(false);
            setStatus('error');
          } else if (payload?.code === 'COMPANY_CONTEXT_REQUIRED') {
            setAuthed(false);
            setStatus('idle');
          }
          return;
        }
        default:
          return;
      }
    },
    [appendMessage, queryClient],
  );

  const userIdRef = useRef<string | null>(null);
  userIdRef.current = userId;
  const tokenRef = useRef<string | null>(null);

  const connect = useCallback(() => {
    if (typeof window === 'undefined') return;
    const token = readToken();
    if (!token || !hasCompanyChatContext(token)) {
      if (wsRef.current) {
        try {
          wsRef.current.close();
        } catch {}
        wsRef.current = null;
      }
      setAuthed(false);
      setStatus('idle');
      return;
    }
    const socket = wsRef.current;
    if (
      socket &&
      (socket.readyState === WebSocket.OPEN || socket.readyState === WebSocket.CONNECTING)
    ) {
      return;
    }
    tokenRef.current = token;
    setStatus('connecting');
    let ws: WebSocket;
    try {
      ws = new WebSocket(wsUrl());
    } catch {
      setStatus('error');
      return;
    }
    wsRef.current = ws;
    ws.onopen = () => {
      setStatus('open');
      ws.send(JSON.stringify({ event: CHAT_WS_EVENTS.AUTH, payload: { token: tokenRef.current } }));
    };
    ws.onmessage = (e) => dispatch(e.data);
    ws.onerror = () => {
      setStatus('error');
    };
    ws.onclose = () => {
      setAuthed(false);
      ackTimersRef.current.forEach((t) => clearTimeout(t));
      ackTimersRef.current.clear();
      if (!mountedRef.current) {
        setStatus('closed');
        return;
      }
      setStatus('closed');
      const curToken = readToken();
      if (!curToken || !hasCompanyChatContext(curToken)) {
        setStatus('idle');
        return;
      }
      const attempt = attemptsRef.current + 1;
      attemptsRef.current = attempt;
      const delay =
        Math.min(MAX_BACKOFF_MS, 1000 * 2 ** Math.min(attempt, 5)) + Math.random() * 1000;
      clearRetry();
      retryTimerRef.current = setTimeout(() => {
        if (mountedRef.current) connect();
      }, delay);
    };
  }, [dispatch]);

  const reconnect = useCallback(() => {
    attemptsRef.current = 0;
    clearRetry();
    try {
      wsRef.current?.close();
    } catch {
      // abaikan
    }
    wsRef.current = null;
    connect();
  }, [connect]);

  useEffect(() => {
    mountedRef.current = true;
    connect();
    const sweep = setInterval(() => {
      setTyping((prev) => {
        const now = Date.now();
        let changed = false;
        const next: Record<string, TypingEntry[]> = {};
        for (const [k, list] of Object.entries(prev)) {
          const kept = list.filter((t) => t.expiresAt > now);
          if (kept.length !== list.length) changed = true;
          if (kept.length) next[k] = kept;
          else changed = true;
        }
        return changed ? next : prev;
      });
    }, 5000);
    const ackTimers = ackTimersRef.current;
    return () => {
      mountedRef.current = false;
      clearInterval(sweep);
      clearRetry();
      ackTimers.forEach((t) => clearTimeout(t));
      try {
        wsRef.current?.close();
      } catch {
        // abaikan
      }
      wsRef.current = null;
    };
  }, [connect]);

  const subscribe = useCallback((conversationId: string) => {
    subsRef.current.add(conversationId);
    const ws = wsRef.current;
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ event: CHAT_WS_EVENTS.SUBSCRIBE, payload: { conversationId } }));
    }
  }, []);

  const unsubscribe = useCallback((conversationId: string) => {
    subsRef.current.delete(conversationId);
    const ws = wsRef.current;
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ event: CHAT_WS_EVENTS.UNSUBSCRIBE, payload: { conversationId } }));
    }
    setTyping((prev) => {
      if (!prev[conversationId]) return prev;
      const next = { ...prev };
      delete next[conversationId];
      return next;
    });
    setPeerReads((prev) => {
      if (!prev[conversationId]) return prev;
      const next = { ...prev };
      delete next[conversationId];
      return next;
    });
  }, []);

  const sendTyping = useCallback((conversationId: string, isTyping: boolean) => {
    const ws = wsRef.current;
    if (!ws || ws.readyState !== WebSocket.OPEN) return;
    ws.send(
      JSON.stringify({
        event: isTyping ? CHAT_WS_EVENTS.TYPING_START : CHAT_WS_EVENTS.TYPING_STOP,
        payload: { conversationId },
      }),
    );
  }, []);

  const sendRead = useCallback((conversationId: string, seq: number) => {
    const ws = wsRef.current;
    if (!ws || ws.readyState !== WebSocket.OPEN || !seq) return;
    ws.send(JSON.stringify({ event: CHAT_WS_EVENTS.READ, payload: { conversationId, seq } }));
  }, []);

  const sendMessage = useCallback(
    (conversationId: string, body: string, options?: { isUrgent?: boolean }): string | null => {
      const ws = wsRef.current;
      const text = body.trim();
      if (!ws || ws.readyState !== WebSocket.OPEN || !text) return null;
      const clientMessageId = crypto.randomUUID();
      const temp: LocalChatMessage = {
        id: `local-${clientMessageId}`,
        conversationId,
        senderId: userIdRef.current ?? '',
        senderMemberId: '',
        clientMessageId,
        seq: 0,
        body: text,
        isUrgent: options?.isUrgent,
        createdAt: new Date().toISOString(),
        senderName: fullNameRef.current,
        sendStatus: 'sending',
      };
      appendMessage(conversationId, temp);
      ws.send(
        JSON.stringify({
          event: CHAT_WS_EVENTS.SEND,
          payload: {
            conversationId,
            clientMessageId,
            body: text,
            isUrgent: options?.isUrgent,
          },
        }),
      );
      const timer = setTimeout(
        () => markFailedRef.current(conversationId, clientMessageId),
        ACK_TIMEOUT_MS,
      );
      ackTimersRef.current.set(clientMessageId, timer);
      void queryClient.invalidateQueries({ queryKey: queryKey.chat.conversations() });
      return clientMessageId;
    },
    [appendMessage, queryClient],
  );

  const markFailedLocal = useCallback(
    (conversationId: string, clientMessageId: string) => {
      const key = queryKey.chat.messages(conversationId);
      queryClient.setQueryData<MessagesCache>(key, (old) => {
        if (!old) return old;
        return {
          ...old,
          pages: old.pages.map((page) => ({
            ...page,
            data: page.data.map((m) =>
              m.clientMessageId === clientMessageId && m.sendStatus === 'sending'
                ? { ...m, sendStatus: 'failed' as const }
                : m,
            ),
          })),
        };
      });
    },
    [queryClient],
  );
  const markFailedRef = useRef(markFailedLocal);
  markFailedRef.current = markFailedLocal;

  const retryMessage = useCallback(
    (conversationId: string, clientMessageId: string) => {
      const ws = wsRef.current;
      if (!ws || ws.readyState !== WebSocket.OPEN) return;
      const key = queryKey.chat.messages(conversationId);
      const cached = queryClient.getQueryData<MessagesCache>(key);
      const found = cached?.pages
        .flatMap((p) => p.data)
        .find((m) => m.clientMessageId === clientMessageId && m.sendStatus === 'failed');
      if (!found) return;
      queryClient.setQueryData<MessagesCache>(key, (old) => {
        if (!old) return old;
        return {
          ...old,
          pages: old.pages.map((page) => ({
            ...page,
            data: page.data.map((m) =>
              m.clientMessageId === clientMessageId ? { ...m, sendStatus: 'sending' as const } : m,
            ),
          })),
        };
      });
      ws.send(
        JSON.stringify({
          event: CHAT_WS_EVENTS.SEND,
          payload: { conversationId, clientMessageId, body: found.body },
        }),
      );
      const oldTimer = ackTimersRef.current.get(clientMessageId);
      if (oldTimer) clearTimeout(oldTimer);
      const timer = setTimeout(
        () => markFailedRef.current(conversationId, clientMessageId),
        ACK_TIMEOUT_MS,
      );
      ackTimersRef.current.set(clientMessageId, timer);
    },
    [queryClient],
  );

  const value = useMemo<ChatSocketValue>(
    () => ({
      status,
      authed,
      userId,
      subscribe,
      unsubscribe,
      sendMessage,
      retryMessage,
      sendTyping,
      sendRead,
      reconnect,
      typing,
      peerReads,
    }),
    [
      status,
      authed,
      userId,
      subscribe,
      unsubscribe,
      sendMessage,
      retryMessage,
      sendTyping,
      sendRead,
      reconnect,
      typing,
      peerReads,
    ],
  );

  return <ChatSocketContext.Provider value={value}>{children}</ChatSocketContext.Provider>;
}

export function useChatSocket(): ChatSocketValue {
  const ctx = useContext(ChatSocketContext);
  if (!ctx) throw new Error('useChatSocket harus dipakai di dalam ChatSocketProvider');
  return ctx;
}
