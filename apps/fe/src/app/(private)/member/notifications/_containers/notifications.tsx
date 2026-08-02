"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { PageHeader } from "@/components/molecules/PageHeader";
import { NotificationListSection } from "@/components/page/private/member/notifications/notification-list.section";
import { useApi } from "@/hooks/useApi/useApi";
import type { NotificationInAppQuery } from "@repo/types";

export default function NotificationsContainer() {
  const api = useApi();
  const router = useRouter();

  const [listQuery, setListQuery] = useState<NotificationInAppQuery>({
    page: 1,
    limit: 10,
    search: "",
  });

  const query: NotificationInAppQuery = listQuery;

  const { data: notifications = [], isLoading } =
    api.notification.query.get(query);
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
    <div className="animate-in fade-in duration-700">
      <PageHeader
        title="Notifikasi"
        description="Pantau pemberitahuan dan aktivitas terbaru."
      />
      <div className="w-full">
        <NotificationListSection
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
      </div>
    </div>
  );
}
