'use client';

import { usePathname } from 'next/navigation';

import { DetailShell } from '@/components/molecules/DetailShell';
import { NotificationDetailSection } from '@/components/page/private/member/notifications/notification-detail.section';
import { useApi } from '@/hooks/useApi/useApi';

export default function NotificationDetailContainer({ id }: { id: string }) {
  const api = useApi();
  const pathname = usePathname();
  const listRoute = pathname.includes('/owner/') ? '/owner/notifications' : '/member/notifications';

  const { data: notification, isLoading } = api.notification.query.getByID(id);
  const markRead = api.notification.mutate.markRead();

  const handleMarkRead = () => {
    if (!notification) return;
    markRead.mutate(notification.id);
  };

  return (
    <DetailShell
      title="Detail Notifikasi"
      description="Lihat isi pemberitahuan secara lengkap."
      backHref={listRoute}
      isLoading={isLoading || !notification}
    >
      {notification && (
        <NotificationDetailSection
          service={{ handleMarkRead }}
          state={{ notification, isPending: markRead.isPending }}
        />
      )}
    </DetailShell>
  );
}
