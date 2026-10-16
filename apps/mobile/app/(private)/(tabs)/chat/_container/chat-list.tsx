'use client';
import { router } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';

import {
  type ChatListItemVM,
  ChatListSection,
  type ChatUserVM,
} from '@/components/section/private/chat/chat-list.section';
import { useApi } from '@/hooks/service/useApi';
import { useChatSocket } from '@/hooks/useChatSocket';
import { useDebounce } from '@/hooks/useDebounce';

function initials(name?: string | null) {
  if (!name) return '?';
  return name
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

function timeLabel(iso?: string | null) {
  if (!iso) return '';
  const d = new Date(iso);
  const now = new Date();
  if (d.toDateString() === now.toDateString()) {
    return d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }).replace('.', ':');
  }
  return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
}

export function MobileChatListContainer() {
  const api = useApi();
  const { status, subscribe, unsubscribe } = useChatSocket();

  const [filter, setFilter] = useState('');
  const [showNew, setShowNew] = useState(false);
  const [showGroup, setShowGroup] = useState(false);
  const [userQuery, setUserQuery] = useState('');
  const [groupName, setGroupName] = useState('');
  const [picked, setPicked] = useState<string[]>([]);

  const debouncedUserQuery = useDebounce(userQuery, 400);
  const { data: conversations = [], isLoading, isError, refetch } = api.chat.query.conversations();
  const { data: users = [], isLoading: isSearching } = api.chat.query.userSearch(
    debouncedUserQuery ? { search: debouncedUserQuery } : undefined,
  );
  const openDirect = api.chat.mutate.openDirect();
  const createGroup = api.chat.mutate.createGroup();

  const idsKey = useMemo(() => conversations.map((c) => c.id).join(','), [conversations]);
  useEffect(() => {
    if (!idsKey) return;
    const ids = idsKey.split(',');
    for (const id of ids) subscribe(id);
    return () => {
      for (const id of ids) unsubscribe(id);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idsKey]);

  const filtered = useMemo(() => {
    const q = filter.trim().toLowerCase();
    if (!q) return conversations;
    return conversations.filter((c) => {
      const name = (c.type === 'DIRECT' ? c.peerName || c.name : c.name) || '';
      return (
        name.toLowerCase().includes(q) || (c.lastMessage?.body || '').toLowerCase().includes(q)
      );
    });
  }, [conversations, filter]);

  const items: ChatListItemVM[] = useMemo(
    () =>
      filtered.map((c) => {
        const displayName =
          c.type === 'DIRECT' ? c.peerName || c.name || 'Direct' : c.name || 'Grup';
        return {
          id: c.id,
          displayName,
          preview: c.lastMessage?.body || 'Belum ada pesan',
          memberSuffix: c.type === 'GROUP' ? `${c.memberCount} anggota` : null,
          timeLabel: timeLabel(c.lastMessage?.createdAt),
          unreadLabel: c.unreadCount > 0 ? (c.unreadCount > 99 ? '99+' : `${c.unreadCount}`) : null,
          initials: initials(displayName),
        };
      }),
    [filtered],
  );

  const userVMs: ChatUserVM[] = useMemo(
    () =>
      users.map((u) => ({
        id: u.id,
        fullName: u.fullName,
        email: u.email,
        initials: initials(u.fullName),
      })),
    [users],
  );

  return (
    <ChatListSection
      service={{
        conversations: items,
        users: userVMs,
        isLoading,
        isError,
        isSearching,
        connected: status === 'open',
        openDirectPending: openDirect.isPending,
        createGroupPending: createGroup.isPending,
        pickedCount: picked.length,
        onRetry: () => refetch(),
        onOpenConversation: (id) => router.push(`/(private)/(tabs)/chat/${id}` as any),
        onStartDirect: (userId) =>
          openDirect.mutate(
            { userId },
            {
              onSuccess: (res) => {
                setShowNew(false);
                setUserQuery('');
                router.push(`/(private)/(tabs)/chat/${res.data.id}` as any);
              },
            },
          ),
        onSubmitGroup: () => {
          if (!groupName.trim() || picked.length === 0 || createGroup.isPending) return;
          createGroup.mutate(
            { name: groupName.trim(), memberUserIds: picked },
            {
              onSuccess: (res) => {
                setShowGroup(false);
                setGroupName('');
                setPicked([]);
                router.push(`/(private)/(tabs)/chat/${res.data.id}` as any);
              },
            },
          );
        },
        onTogglePick: (id) =>
          setPicked((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id])),
      }}
      state={{
        filter,
        setFilter,
        showNew,
        setShowNew,
        showGroup,
        setShowGroup,
        userQuery,
        setUserQuery,
        groupName,
        setGroupName,
        picked,
      }}
    />
  );
}
