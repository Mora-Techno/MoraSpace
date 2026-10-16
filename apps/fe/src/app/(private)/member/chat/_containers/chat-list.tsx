'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

import { ChatListSection } from '@/components/page/private/member/chat/chat-list.section';
import { useApi } from '@/hooks/useApi/useApi';
import { hasCompanyChatContext, useChatSocket } from '@/hooks/useChatSocket';
import { useDebounce } from '@/hooks/useDebounce';
import { loadAuthSession } from '@/utils/storage';

export default function ChatListContainer() {
  const router = useRouter();
  const pathname = usePathname();
  const base = pathname.startsWith('/owner') ? '/owner/member/chat' : '/member/chat';
  const api = useApi();
  const { status, subscribe, unsubscribe } = useChatSocket();

  const isPersonal = useMemo(() => {
    if (typeof window === 'undefined') return false;
    const token = loadAuthSession()?.accessToken ?? null;
    return !hasCompanyChatContext(token);
  }, []);

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

  return (
    <ChatListSection
      service={{
        conversations: filtered,
        users,
        isLoading,
        isError,
        isSearching,
        status,
        isPersonal,
        openDirectPending: openDirect.isPending,
        createGroupPending: createGroup.isPending,
        onRetry: () => refetch(),
        onOpenConversation: (id) => router.push(`${base}/${id}`),
        onStartDirect: (userId) =>
          openDirect.mutate(
            { userId },
            {
              onSuccess: (res) => {
                setShowNew(false);
                setUserQuery('');
                router.push(`${base}/${res.data.id}`);
              },
            },
          ),
        onSubmitGroup: (e) => {
          e.preventDefault();
          if (!groupName.trim() || picked.length === 0 || createGroup.isPending) return;
          createGroup.mutate(
            { name: groupName.trim(), memberUserIds: picked },
            {
              onSuccess: (res) => {
                setShowGroup(false);
                setGroupName('');
                setPicked([]);
                router.push(`${base}/${res.data.id}`);
              },
            },
          );
        },
        onTogglePick: (id) =>
          setPicked((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id])),
        onBackToDashboard: () => router.push('/member/dashboard'),
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
        setPicked,
      }}
    />
  );
}
