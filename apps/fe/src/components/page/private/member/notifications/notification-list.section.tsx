import { formatDateTime } from "@repo/utils/time-format";
import type { NotificationInAppQuery, NotificationInApp } from "@repo/types";
import { ChevronLeft, ChevronRight, MailOpen, Search } from "lucide-react";
import { Button } from "@/components/atoms";
import { Input } from "@/components/atoms/Input";
import { GhibliCard } from "@/components/molecules";
import { GhibliEmptyState } from "@/components/template/GhibliEmptyState";

interface NotificationListSectionProps {
  service: {
    onSearch: (search: string) => void;
    onPageChange: (page: number) => void;
    handleSelect: (id: string) => void;
    handleMarkRead: (e: React.MouseEvent, id: string) => void;
    handleMarkAllRead: () => void;
  };
  state: {
    notifications: NotificationInApp[];
    isLoading: boolean;
    isPending: boolean;
    query: NotificationInAppQuery;
  };
}

export function NotificationListSection({
  service,
  state,
}: NotificationListSectionProps) {
  const { notifications, isLoading, isPending, query } = state;
  const disableNext = notifications.length < (query.limit || 10);
  const currentPage = query.page || 1;

  return (
    <div className="space-y-4">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Cari notifikasi..."
              value={query.search || ""}
              onChange={(e) => service.onSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <Button
            onClick={service.handleMarkAllRead}
            disabled={isLoading || isPending || notifications.length === 0}
            className="w-full sm:w-auto"
          >
            Tandai Semua Dibaca
          </Button>
        </div>
      </div>

      <GhibliCard hover={false}>
        {isLoading ? (
          <div className="mt-8 space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="h-24 w-full animate-pulse rounded-2xl bg-muted/50"
              />
            ))}
          </div>
        ) : notifications.length === 0 ? (
          <div className="mt-8">
            <GhibliEmptyState
              title="Tidak ada notifikasi"
              description="Anda belum memiliki notifikasi saat ini"
              emoji="🔔"
            />
          </div>
        ) : (
          <ul className="mt-6 flex flex-col gap-3 pb-4">
            {notifications.map((notification) => (
              <li
                key={notification.id}
                onClick={() => service.handleSelect(notification.id)}
                className="group relative cursor-pointer list-none overflow-hidden rounded-2xl border border-border/50 bg-background/50 p-4 transition-all duration-300 hover:border-primary/30 hover:bg-muted/30 hover:shadow-lg hover:-translate-y-1"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex flex-col flex-1 pl-2 pb-2">
                    <div className="flex items-center gap-2 mb-1">
                      <h4
                        className={`text-base font-semibold ${!notification.readAt ? "text-primary" : "text-foreground"}`}
                      >
                        {notification.title}
                      </h4>
                      {!notification.readAt && (
                        <span className="h-2 w-2 rounded-full bg-primary" />
                      )}
                    </div>
                    <p className="line-clamp-2 text-sm text-muted-foreground mt-1">
                      {notification.body}
                    </p>
                    <div className="mt-2 text-xs text-muted-foreground/80 font-medium">
                      {formatDateTime(notification.createdAt)}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {!notification.readAt && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="opacity-0 transition-opacity group-hover:opacity-100 h-8 w-8 text-primary hover:text-primary hover:bg-primary/10"
                        title="Tandai dibaca"
                        onClick={(e) =>
                          service.handleMarkRead(e, notification.id)
                        }
                        type="button"
                      >
                        <MailOpen className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-6 flex justify-center gap-2 border-t border-border/50 pt-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => service.onPageChange(currentPage - 1)}
            disabled={currentPage === 1 || isLoading || isPending}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => service.onPageChange(currentPage + 1)}
            disabled={disableNext || isLoading || isPending}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </GhibliCard>
    </div>
  );
}
