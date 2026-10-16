'use client';

import type { NotificationInAppQuery } from '@repo/types';

import { PageHeader } from '@/components/molecules/PageHeader';
import { NotificationListSection } from '@/components/page/private/member/notifications/notification-list.section';

interface NotificationsPageSectionProps {
  service: {
    onSearch: (search: string) => void;
    onPageChange: (page: number) => void;
    handleSelect: (id: string) => void;
    handleMarkRead: (e: React.MouseEvent, id: string) => void;
    handleMarkAllRead: () => void;
  };
  state: {
    notifications: Parameters<typeof NotificationListSection>[0]['state']['notifications'];
    isLoading: boolean;
    isPending: boolean;
    query: NotificationInAppQuery;
  };
}

export function NotificationsPageSection({ service, state }: NotificationsPageSectionProps) {
  const { onSearch, onPageChange, handleSelect, handleMarkRead, handleMarkAllRead } = service;
  const { notifications, isLoading, isPending, query } = state;

  return (
    <div className="animate-in fade-in duration-700">
      <PageHeader title="Notifikasi" description="Pantau pemberitahuan dan aktivitas terbaru." />
      <div className="w-full">
        <NotificationListSection
          service={{
            onSearch,
            onPageChange,
            handleSelect,
            handleMarkRead,
            handleMarkAllRead,
          }}
          state={{
            notifications,
            isLoading,
            isPending,
            query,
          }}
        />
      </div>
    </div>
  );
}

export default NotificationsPageSection;
