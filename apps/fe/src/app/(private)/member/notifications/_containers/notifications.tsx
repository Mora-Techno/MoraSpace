'use client';

import type { NotificationInAppQuery } from '@repo/types';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { NotificationsPageSection } from '@/components/page/private/member/notifications/notifications-page.section';
import { useApi } from '@/hooks/useApi/useApi';

export default function NotificationsContainer() {
  const api = useApi();
  const router = useRouter();

  const [listQuery, setListQuery] = useState<NotificationInAppQuery>({
    page: 1,
    limit: 10,
    search: '',
  });

  const query: NotificationInAppQuery = listQuery;

  const { data: notifications = [], isLoading } = api.notification.query.get(query);
  const markRead = api.notification.mutate.markRead();
  const markAllRead = api.notification.mutate.markAllRead();

  const handleSearch = (search: string) => {
    setListQuery((prev) => ({ ...prev, search, page: 1 }));
  };

  const handlePageChange = (page: number) => {
    setListQuery((prev) => ({ ...prev, page }));
  };

  const handleSelect = (id: string) => {
    router.push(`/member/notifications/${id}`);
  };

  const handleMarkRead = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    markRead.mutate(id);
  };

  const handleMarkAllRead = () => {
    markAllRead.mutate();
  };

  const isPending = markRead.isPending || markAllRead.isPending;

  return (
    <NotificationsPageSection
      service={{
        onSearch: handleSearch,
        onPageChange: handlePageChange,
        handleSelect,
        handleMarkRead,
        handleMarkAllRead,
      }}
      state={{
        notifications,
        isLoading,
        isPending,
        query: listQuery,
      }}
    />
  );
}
