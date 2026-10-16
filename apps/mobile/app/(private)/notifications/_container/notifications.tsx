import { useMemo, useState } from 'react';

import { NotificationsSection } from '@/components/section/private/notifications/notifications.section';
import { useNotification } from '@/hooks/service/Notification/useNotification';

export function MobileNotificationsContainer() {
  const { query, mutate } = useNotification();

  const { data: rawNotifications = [], isLoading, isError, refetch, isFetching } = query.list();
  const markRead = mutate.markRead();
  const markAllRead = mutate.markAllRead();

  const [filterMode, setFilterMode] = useState<'all' | 'unread'>('all');

  const notifications = useMemo(() => {
    if (!Array.isArray(rawNotifications)) return [];
    if (filterMode === 'unread') {
      return rawNotifications.filter((n) => !n.readAt);
    }
    return rawNotifications;
  }, [rawNotifications, filterMode]);

  const unreadCount = useMemo(() => {
    if (!Array.isArray(rawNotifications)) return 0;
    return rawNotifications.filter((n) => !n.readAt).length;
  }, [rawNotifications]);

  const handleMarkRead = (id: string) => {
    markRead.mutate(id);
  };

  const handleMarkAllRead = () => {
    markAllRead.mutate();
  };

  return (
    <NotificationsSection
      service={{
        notifications,
        totalCount: Array.isArray(rawNotifications) ? rawNotifications.length : 0,
        unreadCount,
        isLoading,
        isError,
        isFetching,
        markAllPending: markAllRead.isPending,
        onMarkRead: handleMarkRead,
        onMarkAllRead: handleMarkAllRead,
        onRetry: () => refetch(),
      }}
      state={{
        filterMode,
        setFilterMode,
      }}
    />
  );
}
