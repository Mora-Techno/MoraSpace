'use client';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo, useRef, useState } from 'react';

import { ChatRoomSection } from '@/components/section/private/chat/chat-room.section';
import { useApi } from '@/hooks/service/useApi';
import { type LocalChatMessage, useChatSocket } from '@/hooks/useChatSocket';
import { useDebounce } from '@/hooks/useDebounce';

export function MobileChatRoomContainer() {
  const { id } = useLocalSearchParams<{ id: string }>();
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
  const [addQuery, setAddQuery] = useState('');
  const debouncedAddQuery = useDebounce(addQuery, 400);
  const { data: addCandidates = [] } = api.chat.query.userSearch(
    debouncedAddQuery ? { search: debouncedAddQuery } : undefined,
  );
  const lastTypeRef = useRef(0);

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
  const [isUrgent, setIsUrgent] = useState(false);

  const flat = useMemo(() => {
    const pages = messagesQuery.data?.pages ?? [];
    return pages.flatMap((p) => p.data).reverse() as LocalChatMessage[];
  }, [messagesQuery.data]);
  const maxSeq = useMemo(() => flat.reduce((m, x) => Math.max(m, x.seq), 0), [flat]);

  useEffect(() => {
    if (!id) return;
    subscribe(id);
    return () => unsubscribe(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    if (id && maxSeq) sendRead(id, maxSeq);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, maxSeq]);

  const handleInput = (v: string) => {
    setDraft(v);
    if (!id) return;
    const now = Date.now();
    if (now - lastTypeRef.current > 3000) {
      lastTypeRef.current = now;
      sendTyping(id, true);
    }
  };

  const handleSend = () => {
    if (!id || !draft.trim()) return;
    const cmid = sendMessage(id, draft, { isUrgent });
    if (cmid) {
      setDraft('');
      setIsUrgent(false);
      sendTyping(id, false);
      lastTypeRef.current = 0;
    }
  };

  const typers = (id ? (typing[id] ?? []) : []).filter((t) => t.userId !== userId);
  const peerRead = id ? peerReads[id] : undefined;

  if (!id) return null;

  return (
    <ChatRoomSection
      service={{
        title,
        isGroup: !!isGroup,
        memberCount: members.length,
        groupNameDisplay: conversation?.name ?? 'Grup',
        status,
        userId,
        peerStatus: peerStatus
          ? { status: peerStatus.status, statusLabel: peerStatus.statusLabel }
          : null,
        messages: flat,
        hasNextPage: messagesQuery.hasNextPage ?? false,
        isFetchingNextPage: messagesQuery.isFetchingNextPage,
        isLoading: messagesQuery.isLoading,
        isError: messagesQuery.isError,
        typers,
        peerReadSeq: peerRead?.seq ?? null,
        urgentQuota: urgentQuota
          ? { remainingToday: urgentQuota.remainingToday, dailyLimit: urgentQuota.dailyLimit }
          : null,
        isUrgent,
        newCount: 0,
        members,
        availableCandidates: addCandidates
          .filter((u) => !members.some((mm) => mm.userId === u.id))
          .slice(0, 5),
        canManage,
        isOwner,
        updateGroupPending: updateGroup.isPending,
        addMemberPending: addMember.isPending,
        setMemberRolePending: setMemberRole.isPending,
        removeMemberPending: removeMember.isPending,
        transferPending: transferOwnership.isPending,
        leavePending: leaveConversation.isPending,
        onBack: () => router.back(),
        onOpenInfo: () => {
          setEditName(conversation?.name || '');
          setShowInfo(true);
        },
        onCloseInfo: () => setShowInfo(false),
        onEndReached: () => {
          if (messagesQuery.hasNextPage && !messagesQuery.isFetchingNextPage) {
            void messagesQuery.fetchNextPage();
          }
        },
        onInput: handleInput,
        onSend: handleSend,
        onBlurStop: () => {
          if (id) sendTyping(id, false);
        },
        onRetryMessage: (clientMessageId) => {
          if (id) retryMessage(id, clientMessageId);
        },
        onToggleUrgent: () => setIsUrgent((p) => !p),
        onSaveGroup: () => {
          if (id) updateGroup.mutate({ id, payload: { name: editName.trim() || undefined } });
        },
        onAddMember: (userId) => {
          if (!id) return;
          addMember.mutate({ id, payload: { userId } });
          setAddQuery('');
        },
        onSetRole: (userId, toAdmin) => {
          if (!id) return;
          setMemberRole.mutate({ id, payload: { userId, role: toAdmin ? 'ADMIN' : 'MEMBER' } });
        },
        onRemoveMember: (userId) => {
          if (id) removeMember.mutate({ id, userId });
        },
        onTransfer: (userId) => {
          if (id) transferOwnership.mutate({ id, payload: { newOwnerId: userId } });
        },
        onLeave: () =>
          leaveConversation.mutate(
            { id: id as string },
            {
              onSuccess: () => {
                setShowInfo(false);
                router.back();
              },
            },
          ),
      }}
      state={{
        draft,
        setDraft,
        showInfo,
        setShowInfo,
        editName,
        setEditName,
        addQuery,
        setAddQuery,
      }}
    />
  );
}
