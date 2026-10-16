'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';

import { ChatRoomSection } from '@/components/page/private/member/chat/chat-room.section';
import { useApi } from '@/hooks/useApi/useApi';
import { hasCompanyChatContext, type LocalChatMessage, useChatSocket } from '@/hooks/useChatSocket';
import { useDebounce } from '@/hooks/useDebounce';
import { loadAuthSession } from '@/utils/storage';

export default function ChatRoomContainer({ id }: { id: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const base = pathname.startsWith('/owner') ? '/owner/member/chat' : '/member/chat';
  const api = useApi();
  const {
    status,
    userId,
    subscribe,
    unsubscribe,
    sendMessage,
    retryMessage,
    sendTyping,
    sendRead,
    typing,
    peerReads,
  } = useChatSocket();

  const isPersonal = useMemo(() => {
    if (typeof window === 'undefined') return false;
    const token = loadAuthSession()?.accessToken ?? null;
    return !hasCompanyChatContext(token);
  }, []);

  const messagesQuery = api.chat.query.messages(id);
  const { data: members = [] } = api.chat.query.members(id);
  const { data: conversations = [] } = api.chat.query.conversations();
  const updateGroup = api.chat.mutate.updateGroup();
  const addMember = api.chat.mutate.addMember();
  const setMemberRole = api.chat.mutate.setMemberRole();
  const removeMember = api.chat.mutate.removeMember();
  const leaveConversation = api.chat.mutate.leave();
  const transferOwnership = api.chat.mutate.transferOwnership();

  const [draft, setDraft] = useState('');
  const [showInfo, setShowInfo] = useState(false);
  const [editName, setEditName] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [addQuery, setAddQuery] = useState('');
  const [transferTo, setTransferTo] = useState('');
  const [isUrgent, setIsUrgent] = useState(false);
  const debouncedAddQuery = useDebounce(addQuery, 400);
  const { data: addCandidates = [] } = api.chat.query.userSearch(
    debouncedAddQuery ? { search: debouncedAddQuery } : undefined,
  );

  const scrollRef = useRef<HTMLDivElement>(null);
  const stickRef = useRef(true);
  const lastSeenRef = useRef(0);
  const lastTypeRef = useRef(0);
  const [newCount, setNewCount] = useState(0);

  const conversation = conversations.find((c) => c.id === id);
  const myMember = members.find((m) => m.userId === userId);
  const isGroup = conversation?.type === 'GROUP';
  const title = isGroup
    ? conversation?.name || 'Grup'
    : conversation?.peerName || conversation?.name || 'Direct';
  const canManage = myMember?.role === 'OWNER' || myMember?.role === 'ADMIN';
  const isOwner = myMember?.role === 'OWNER';

  const peer = !isGroup ? members.find((m) => m.userId !== userId) : undefined;
  const peerMemberId = peer?.companyMemberId || peer?.userId;
  const { data: peerStatusData } = api.workingHours.query.memberStatus(peerMemberId);
  const peerStatus = Array.isArray(peerStatusData) ? peerStatusData[0] : peerStatusData;
  const { data: urgentQuota } = api.workingHours.query.urgentQuota();

  const availableCandidates = useMemo(
    () => addCandidates.filter((u) => !members.some((m) => m.userId === u.id)),
    [addCandidates, members],
  );

  const flat = useMemo(() => {
    const pages = messagesQuery.data?.pages ?? [];
    return [...pages].reverse().flatMap((p) => p.data) as LocalChatMessage[];
  }, [messagesQuery.data]);

  const maxSeq = useMemo(() => flat.reduce((m, x) => Math.max(m, x.seq), 0), [flat]);

  useEffect(() => {
    subscribe(id);
    return () => unsubscribe(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    if (!maxSeq || document.visibilityState !== 'visible') return;
    sendRead(id, maxSeq);
  }, [id, maxSeq, sendRead]);
  useEffect(() => {
    const onVisible = () => {
      if (document.visibilityState === 'visible' && maxSeq) sendRead(id, maxSeq);
    };
    document.addEventListener('visibilitychange', onVisible);
    window.addEventListener('focus', onVisible);
    return () => {
      document.removeEventListener('visibilitychange', onVisible);
      window.removeEventListener('focus', onVisible);
    };
  }, [id, maxSeq, sendRead]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    if (stickRef.current) {
      el.scrollTop = el.scrollHeight;
      lastSeenRef.current = maxSeq;
      setNewCount(0);
    } else if (maxSeq > lastSeenRef.current) {
      const fresh = flat.filter((m) => m.seq > lastSeenRef.current && m.senderId !== userId).length;
      setNewCount(fresh);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flat.length, maxSeq]);

  const onScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    const nearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 120;
    stickRef.current = nearBottom;
    if (nearBottom) {
      lastSeenRef.current = maxSeq;
      setNewCount(0);
    }
    if (el.scrollTop < 200 && messagesQuery.hasNextPage && !messagesQuery.isFetchingNextPage) {
      const prevHeight = el.scrollHeight;
      const prevTop = el.scrollTop;
      void messagesQuery.fetchNextPage().then(() => {
        requestAnimationFrame(() => {
          const node = scrollRef.current;
          if (node) node.scrollTop = node.scrollHeight - prevHeight + prevTop;
        });
      });
    }
  };

  const scrollBottom = () => {
    const el = scrollRef.current;
    if (!el) return;
    stickRef.current = true;
    lastSeenRef.current = maxSeq;
    setNewCount(0);
    el.scrollTop = el.scrollHeight;
  };

  const stopTyping = () => {
    sendTyping(id, false);
    lastTypeRef.current = 0;
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDraft(e.target.value);
    const now = Date.now();
    if (now - lastTypeRef.current > 3000) {
      lastTypeRef.current = now;
      sendTyping(id, true);
    }
  };

  const handleSend = () => {
    if (!draft.trim()) return;
    const cmid = sendMessage(id, draft, { isUrgent });
    if (cmid) {
      setDraft('');
      setIsUrgent(false);
      stopTyping();
      stickRef.current = true;
      requestAnimationFrame(() => {
        const el = scrollRef.current;
        if (el) el.scrollTop = el.scrollHeight;
      });
    }
  };

  const handleKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const native = e.nativeEvent as KeyboardEvent & { isComposing?: boolean };
    if (native.isComposing) return;
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  useEffect(() => () => stopTyping(), [id]); // eslint-disable-line react-hooks/exhaustive-deps

  const typers = (typing[id] ?? []).filter((t) => t.userId !== userId);
  const peerRead = peerReads[id];

  return (
    <ChatRoomSection
      service={{
        isPersonal,
        isLoading: messagesQuery.isLoading,
        isError: messagesQuery.isError,
        hasNextPage: messagesQuery.hasNextPage ?? false,
        isFetchingNextPage: messagesQuery.isFetchingNextPage,
        flat,
        members,
        availableCandidates,
        title,
        isGroup: !!isGroup,
        memberCount: members.length,
        conversationName: conversation?.name,
        conversationDescription: conversation?.description,
        status,
        userId,
        typers,
        peerReadSeq: peerRead?.seq ?? null,
        peerStatus: peerStatus
          ? { status: peerStatus.status, statusLabel: peerStatus.statusLabel }
          : null,
        urgentQuota: urgentQuota
          ? { remainingToday: urgentQuota.remainingToday, dailyLimit: urgentQuota.dailyLimit }
          : null,
        isUrgent,
        onToggleUrgent: () => setIsUrgent((prev) => !prev),
        newCount,
        canManage,
        isOwner,
        updateGroupPending: updateGroup.isPending,
        addMemberPending: addMember.isPending,
        setMemberRolePending: setMemberRole.isPending,
        removeMemberPending: removeMember.isPending,
        transferPending: transferOwnership.isPending,
        leavePending: leaveConversation.isPending,
        onRetry: () => messagesQuery.refetch(),
        onBack: () => router.push(base),
        onBackToList: () => router.push(base),
        onBackToDashboard: () => router.push('/member/dashboard'),
        onOpenInfo: () => {
          setEditName(conversation?.name || '');
          setEditDesc(conversation?.description || '');
          setShowInfo(true);
        },
        onScroll,
        onLoadOlder: () => void messagesQuery.fetchNextPage(),
        onScrollToBottom: scrollBottom,
        onInput: handleInput,
        onSend: handleSend,
        onKey: handleKey,
        onBlurStop: stopTyping,
        onRetryMessage: (clientMessageId) => retryMessage(id, clientMessageId),
        onSaveGroup: (e) => {
          e.preventDefault();
          updateGroup.mutate({
            id,
            payload: { name: editName.trim() || undefined, description: editDesc.trim() },
          });
        },
        onAddMember: (userId) => addMember.mutate({ id, payload: { userId } }),
        onSetRole: (userId, toAdmin) =>
          setMemberRole.mutate({ id, payload: { userId, role: toAdmin ? 'ADMIN' : 'MEMBER' } }),
        onRemoveMember: (userId) => removeMember.mutate({ id, userId }),
        onTransfer: () => {
          if (!transferTo) return;
          transferOwnership.mutate(
            { id, payload: { newOwnerId: transferTo } },
            { onSuccess: () => setTransferTo('') },
          );
        },
        onLeave: () => leaveConversation.mutate({ id }, { onSuccess: () => router.push(base) }),
      }}
      state={{
        draft,
        setDraft,
        showInfo,
        setShowInfo,
        editName,
        setEditName,
        editDesc,
        setEditDesc,
        addQuery,
        setAddQuery,
        transferTo,
        setTransferTo,
        scrollRef,
      }}
    />
  );
}
