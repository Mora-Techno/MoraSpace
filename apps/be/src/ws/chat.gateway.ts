import Elysia from 'elysia';
import type { ElysiaWS } from 'elysia/ws';
import type { JwtPayload } from '@repo/types/auth.types';
import { CHAT_WS_EVENTS, CHAT_WS_PATH } from '@repo/types/chat.types';
import prisma from 'prisma/client';
import ChatService, { ChatForbiddenError } from '@/service/ChatService';
import { getCorsOrigin } from '@/types/cors';
import { verifySocketToken } from '@/utils/authTokens';

// Transport real-time chat (Elysia native WS, Bun). Single instance:
// registry koneksi in-memory, tanpa pub/sub eksternal.
// Catatan Elysia: wrapper ElysiaWS dibuat BARU di tiap event, jadi state
// di-key by ws.id (stabil per koneksi), bukan by objek wrapper.
// Aturan: auth via pesan pertama (bukan URL); tiap event validasi membership
// aktif; jangan percaya senderId/role dari client; tanpa log isi pesan/token.

type ChatConn = ElysiaWS<any, any>;

type ConnState = {
  userId: string | null;
  claims: JwtPayload | null;
  token: string | null;
  subs: Set<string>;
  typingTimers: Map<string, ReturnType<typeof setTimeout>>;
  authTimer: ReturnType<typeof setTimeout> | null;
};

type ConnEntry = { ws: ChatConn; state: ConnState };

const conns = new Map<string, ConnEntry>();
const connsByUser = new Map<string, Set<string>>();
const rateBuckets = new Map<string, number[]>();

const AUTH_TIMEOUT_MS = 15_000;
const TYPING_TTL_MS = 6_000;
const SEND_PER_MIN = 20;
const TYPING_PER_MIN = 30;
const WS_OPEN = 1;

function entryOf(ws: ChatConn): ConnEntry | undefined {
  const entry = conns.get(ws.id);
  if (entry) entry.ws = ws;
  return entry;
}

function send(entry: ConnEntry, event: string, payload: unknown, reqId?: string) {
  try {
    entry.ws.send(JSON.stringify({ event, ...(reqId ? { reqId } : {}), payload }));
  } catch {
    // koneksi mati — abaikan, cleanup saat close.
  }
}

function sendError(entry: ConnEntry, code: string, message: string, reqId?: string) {
  send(entry, CHAT_WS_EVENTS.ERROR, { code, message }, reqId);
}

function allow(key: string, limit: number, windowMs: number) {
  const now = Date.now();
  const kept = (rateBuckets.get(key) ?? []).filter((ts) => now - ts < windowMs);
  if (kept.length >= limit) {
    rateBuckets.set(key, kept);
    return false;
  }
  kept.push(now);
  rateBuckets.set(key, kept);
  return true;
}

async function activeMemberUserIds(conversationId: string): Promise<string[]> {
  const rows = await prisma.conversationMember.findMany({
    where: { conversationId, leftAt: null },
    select: { userId: true },
  });
  return rows.map((r) => r.userId);
}

function targetEntries(userIds: string[], conversationId: string | null, excludeId?: string) {
  const out: ConnEntry[] = [];
  for (const uid of userIds) {
    for (const id of connsByUser.get(uid) ?? []) {
      if (id === excludeId) continue;
      const entry = conns.get(id);
      if (!entry) continue;
      if (conversationId && !entry.state.subs.has(conversationId)) continue;
      if (entry.ws.readyState !== WS_OPEN) continue;
      out.push(entry);
    }
  }
  return out;
}

// Dipanggil lapisan HTTP setelah mutasi membership: siarkan perubahan,
// dan untuk revoke cabut subscription koneksi yang masih hidup + beri tahu.
export async function emitMembershipChanged(
  conversationId: string,
  userId: string,
  change: 'joined' | 'left' | 'removed' | 'role',
  opts?: { revokeAccess?: boolean },
) {
  const payload = { conversationId, userId, change };
  if (opts?.revokeAccess) {
    for (const id of connsByUser.get(userId) ?? []) {
      const entry = conns.get(id);
      if (!entry) continue;
      entry.state.subs.delete(conversationId);
      clearTyping(entry, conversationId);
      send(entry, CHAT_WS_EVENTS.MEMBERSHIP_CHANGED, payload);
    }
  }
  const actives = await activeMemberUserIds(conversationId);
  for (const entry of targetEntries(actives, conversationId)) {
    send(entry, CHAT_WS_EVENTS.MEMBERSHIP_CHANGED, payload);
  }
}

function actorOf(state: ConnState) {
  const claims = state.claims;
  if (!claims || !state.userId || !claims.companyId || !claims.companyMemberId) return null;
  return {
    userId: state.userId,
    companyId: claims.companyId,
    companyMemberId: claims.companyMemberId,
  };
}

function clearTyping(entry: ConnEntry, conversationId?: string) {
  const ids = conversationId ? [conversationId] : [...entry.state.typingTimers.keys()];
  for (const id of ids) {
    const timer = entry.state.typingTimers.get(id);
    if (timer) clearTimeout(timer);
    entry.state.typingTimers.delete(id);
  }
}

async function broadcastTypingOff(entry: ConnEntry, conversationId: string) {
  const actor = actorOf(entry.state);
  if (!actor) return;
  const actives = await activeMemberUserIds(conversationId);
  for (const target of targetEntries(actives, conversationId, entry.ws.id)) {
    send(target, CHAT_WS_EVENTS.TYPING_UPDATE, {
      conversationId,
      userId: actor.userId,
      isTyping: false,
    });
  }
}

async function handleMessage(ws: ChatConn, raw: unknown) {
  const entry = entryOf(ws);
  if (!entry) return;
  const st = entry.state;
  let msg: { event?: unknown; reqId?: unknown; payload?: unknown };
  try {
    msg = typeof raw === 'string' ? (JSON.parse(raw) as typeof msg) : (raw as typeof msg);
  } catch {
    sendError(entry, 'BAD_ENVELOPE', 'Format pesan tidak valid');
    return;
  }
  if (!msg || typeof msg.event !== 'string') {
    sendError(entry, 'BAD_ENVELOPE', 'Format pesan tidak valid');
    return;
  }
  const reqId = typeof msg.reqId === 'string' ? msg.reqId : undefined;
  const payload = (msg.payload ?? {}) as Record<string, unknown>;

  try {
    if (msg.event === CHAT_WS_EVENTS.AUTH) {
      if (st.claims) {
        sendError(entry, 'ALREADY_AUTH', 'Sudah terautentikasi', reqId);
        return;
      }
      const token = payload.token;
      if (typeof token !== 'string' || !token) {
        sendError(entry, 'AUTH_FAILED', 'Token tidak valid/kedaluwarsa', reqId);
        try {
          entry.ws.close(1008);
        } catch {
          // abaikan
        }
        return;
      }
      const claims = await verifySocketToken(token);
      if (!claims) {
        sendError(entry, 'AUTH_FAILED', 'Token tidak valid/kedaluwarsa', reqId);
        try {
          entry.ws.close(1008);
        } catch {
          // abaikan
        }
        return;
      }
      if (!claims.companyId || !claims.companyMemberId || claims.workspaceType === 'personal') {
        sendError(
          entry,
          'COMPANY_CONTEXT_REQUIRED',
          'Chat hanya tersedia di Company Workspace',
          reqId,
        );
        try {
          entry.ws.close(1000);
        } catch {
          // abaikan
        }
        return;
      }
      st.claims = claims;
      st.token = token;
      st.userId = claims.id;
      if (st.authTimer) clearTimeout(st.authTimer);
      st.authTimer = null;
      let set = connsByUser.get(claims.id);
      if (!set) {
        set = new Set();
        connsByUser.set(claims.id, set);
      }
      set.add(ws.id);
      send(
        entry,
        CHAT_WS_EVENTS.AUTH_OK,
        {
          user: { id: claims.id, companyId: claims.companyId, workspaceType: claims.workspaceType },
        },
        reqId,
      );
      return;
    }

    let actor = actorOf(st);
    if (!actor) {
      sendError(entry, 'AUTH_REQUIRED', 'Autentikasi dulu', reqId);
      return;
    }
    // Re-validasi sesi per event: logout/kedaluwarsa/suspend mencabut akses
    // koneksi yang masih hidup (1 query indexed, murah).
    const fresh = st.token ? await verifySocketToken(st.token) : null;
    if (!fresh) {
      sendError(entry, 'AUTH_FAILED', 'Sesi berakhir, login kembali', reqId);
      try {
        entry.ws.close(1008);
      } catch {
        // abaikan
      }
      return;
    }
    st.claims = fresh;
    actor = actorOf(st);
    if (!actor) {
      sendError(entry, 'AUTH_REQUIRED', 'Autentikasi dulu', reqId);
      return;
    }

    switch (msg.event) {
      case CHAT_WS_EVENTS.SUBSCRIBE: {
        const conversationId = payload.conversationId;
        if (typeof conversationId !== 'string') {
          sendError(entry, 'BAD_PAYLOAD', 'conversationId wajib', reqId);
          return;
        }
        try {
          await ChatService.assertActiveMember(conversationId, actor);
        } catch {
          st.subs.delete(conversationId);
          sendError(entry, 'FORBIDDEN', 'Bukan anggota aktif', reqId);
          return;
        }
        st.subs.add(conversationId);
        send(entry, CHAT_WS_EVENTS.SUBSCRIBED, { conversationId }, reqId);
        return;
      }
      case CHAT_WS_EVENTS.UNSUBSCRIBE: {
        const conversationId = payload.conversationId;
        if (typeof conversationId !== 'string') {
          sendError(entry, 'BAD_PAYLOAD', 'conversationId wajib', reqId);
          return;
        }
        st.subs.delete(conversationId);
        clearTyping(entry, conversationId);
        send(entry, CHAT_WS_EVENTS.UNSUBSCRIBED, { conversationId }, reqId);
        return;
      }
      case CHAT_WS_EVENTS.SEND: {
        if (!allow(`${actor.userId}:send`, SEND_PER_MIN, 60_000)) {
          sendError(entry, 'RATE_LIMITED', 'Terlalu banyak pesan, coba lagi', reqId);
          return;
        }
        const { conversationId, clientMessageId, body } = payload;
        if (
          typeof conversationId !== 'string' ||
          typeof clientMessageId !== 'string' ||
          typeof body !== 'string'
        ) {
          sendError(entry, 'BAD_PAYLOAD', 'conversationId/clientMessageId/body wajib', reqId);
          return;
        }
        try {
          const { message } = await ChatService.sendMessage(
            conversationId,
            actor,
            clientMessageId,
            body,
          );
          send(entry, CHAT_WS_EVENTS.ACK, { clientMessageId, message }, reqId);
          const actives = await activeMemberUserIds(conversationId);
          for (const target of targetEntries(actives, conversationId, ws.id)) {
            send(target, CHAT_WS_EVENTS.NEW, { message });
          }
          const senderName = (message as { senderName?: string }).senderName;
          for (const target of targetEntries(actives, null, ws.id)) {
            send(target, CHAT_WS_EVENTS.CONVERSATION_UPDATED, {
              conversationId,
              lastMessage: {
                id: message.id,
                seq: message.seq,
                body: message.body,
                senderName,
                createdAt: message.createdAt,
              },
              lastSeq: message.seq,
            });
          }
        } catch (error) {
          if (error instanceof ChatForbiddenError) {
            st.subs.delete(conversationId);
            sendError(entry, 'FORBIDDEN', error.message, reqId);
            return;
          }
          sendError(
            entry,
            'SEND_FAILED',
            error instanceof Error ? error.message : 'Gagal mengirim pesan',
            reqId,
          );
          return;
        }
        return;
      }
      case CHAT_WS_EVENTS.TYPING_START: {
        if (!allow(`${actor.userId}:typing`, TYPING_PER_MIN, 60_000)) {
          sendError(entry, 'RATE_LIMITED', 'Terlalu banyak, coba lagi', reqId);
          return;
        }
        const conversationId = payload.conversationId;
        if (typeof conversationId !== 'string') {
          sendError(entry, 'BAD_PAYLOAD', 'conversationId wajib', reqId);
          return;
        }
        try {
          await ChatService.assertActiveMember(conversationId, actor);
        } catch {
          st.subs.delete(conversationId);
          sendError(entry, 'FORBIDDEN', 'Bukan anggota aktif', reqId);
          return;
        }
        const old = st.typingTimers.get(conversationId);
        if (old) clearTimeout(old);
        const actives = await activeMemberUserIds(conversationId);
        for (const target of targetEntries(actives, conversationId, ws.id)) {
          send(target, CHAT_WS_EVENTS.TYPING_UPDATE, {
            conversationId,
            userId: actor.userId,
            fullName: st.claims?.fullName,
            isTyping: true,
          });
        }
        st.typingTimers.set(
          conversationId,
          setTimeout(() => {
            st.typingTimers.delete(conversationId);
            void broadcastTypingOff(entry, conversationId).catch(() => {});
          }, TYPING_TTL_MS),
        );
        return;
      }
      case CHAT_WS_EVENTS.TYPING_STOP: {
        const conversationId = payload.conversationId;
        if (typeof conversationId !== 'string') {
          sendError(entry, 'BAD_PAYLOAD', 'conversationId wajib', reqId);
          return;
        }
        try {
          await ChatService.assertActiveMember(conversationId, actor);
        } catch {
          st.subs.delete(conversationId);
          sendError(entry, 'FORBIDDEN', 'Bukan anggota aktif', reqId);
          return;
        }
        const timer = st.typingTimers.get(conversationId);
        if (timer) clearTimeout(timer);
        st.typingTimers.delete(conversationId);
        await broadcastTypingOff(entry, conversationId);
        return;
      }
      case CHAT_WS_EVENTS.READ: {
        const { conversationId, seq } = payload;
        if (typeof conversationId !== 'string' || typeof seq !== 'number') {
          sendError(entry, 'BAD_PAYLOAD', 'conversationId/seq wajib', reqId);
          return;
        }
        try {
          const { seq: next } = await ChatService.markRead(conversationId, actor, seq);
          const actives = await activeMemberUserIds(conversationId);
          for (const target of targetEntries(actives, conversationId, ws.id)) {
            send(target, CHAT_WS_EVENTS.READ, { conversationId, userId: actor.userId, seq: next });
          }
        } catch (error) {
          if (error instanceof ChatForbiddenError) {
            st.subs.delete(conversationId);
            sendError(entry, 'FORBIDDEN', error.message, reqId);
            return;
          }
          sendError(entry, 'READ_FAILED', 'Gagal menandai dibaca', reqId);
          return;
        }
        return;
      }
      default:
        sendError(entry, 'UNKNOWN_EVENT', 'Event tidak dikenal', reqId);
    }
  } catch {
    sendError(entry, 'INTERNAL', 'Terjadi kesalahan', reqId);
  }
}

function cleanup(ws: ChatConn) {
  const entry = conns.get(ws.id);
  if (!entry) return;
  const { state: st } = entry;
  if (st.authTimer) clearTimeout(st.authTimer);
  // Beri tahu peer bahwa typing berhenti sebelum timer dibuang.
  for (const conversationId of [...st.typingTimers.keys()]) {
    const timer = st.typingTimers.get(conversationId);
    if (timer) clearTimeout(timer);
    st.typingTimers.delete(conversationId);
    void broadcastTypingOff(entry, conversationId).catch(() => {});
  }
  if (st.userId) {
    const set = connsByUser.get(st.userId);
    set?.delete(ws.id);
    if (set && set.size === 0) connsByUser.delete(st.userId);
  }
  conns.delete(ws.id);
}

class ChatGateway {
  public chatWs;

  constructor() {
    this.chatWs = new Elysia().ws(CHAT_WS_PATH, {
      // Catatan: beforeHandle di route WS merusak upgrade (respons 200),
      // jadi validasi origin dilakukan di open + tutup langsung.
      open: (ws) => {
        const conn = ws as ChatConn;
        try {
          const headers = (ws.data as { headers?: Record<string, string | undefined> })?.headers;
          const origin = headers?.origin;
          if (origin && !getCorsOrigin(origin)) {
            try {
              conn.close(1008);
            } catch {
              // abaikan
            }
            return;
          }
        } catch {
          // abaikan, lanjut seperti biasa
        }
        const authTimer = setTimeout(() => {
          const entry = conns.get(conn.id);
          if (entry && !entry.state.claims) {
            try {
              entry.ws.close(1008);
            } catch {
              // abaikan
            }
          }
        }, AUTH_TIMEOUT_MS);
        conns.set(conn.id, {
          ws: conn,
          state: {
            userId: null,
            claims: null,
            token: null,
            subs: new Set(),
            typingTimers: new Map(),
            authTimer,
          },
        });
      },
      message: (ws, raw) => {
        void handleMessage(ws as ChatConn, raw);
      },
      close: (ws) => {
        cleanup(ws as ChatConn);
      },
    });
  }
}

export default new ChatGateway().chatWs;
