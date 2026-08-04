"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Button } from "@/components/atoms";
import { PageHeader } from "@/components/molecules/PageHeader";
import { NotificationDetailSection } from "@/components/page/private/member/notifications/notification-detail.section";
import { useApi } from "@/hooks/useApi/useApi";

export default function NotificationDetailContainer({ id }: { id: string }) {
  const api = useApi();
  const pathname = usePathname();
  const listRoute = pathname.includes("/owner/")
    ? "/owner/notifications"
    : "/member/notifications";

  const { data: notification, isLoading } = api.notification.query.getByID(id);
  const markRead = api.notification.mutate.markRead();

  const handleMarkRead = () => {
    if (!notification) return;
    markRead.mutate(notification.id);
  };

  return (
    <div className="animate-in fade-in duration-700">
      <PageHeader
        title="Detail Notifikasi"
        description="Lihat isi pemberitahuan secara lengkap."
        action={
          <Button variant="outline" size="sm" asChild className="ghibli-btn">
            <Link href={listRoute}>
              <ArrowLeft className="size-4" /> Kembali
            </Link>
          </Button>
        }
      />
      {isLoading || !notification ? (
        <div className="space-y-4">
          <div className="h-8 w-48 animate-pulse rounded-lg bg-muted/50" />
          <div className="h-64 w-full animate-pulse rounded-2xl bg-muted/50" />
        </div>
      ) : (
        <NotificationDetailSection
          service={{ handleMarkRead }}
          state={{ notification, isPending: markRead.isPending }}
        />
      )}
    </div>
  );
}
