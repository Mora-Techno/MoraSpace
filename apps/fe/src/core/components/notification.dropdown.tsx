"use client";

import { formatDateTime } from "@repo/utils/time-format";
import { Bell } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

import {
  Badge,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/atoms";
import { useApi } from "@/hooks/useApi/useApi";

export default function NotificationDropdown() {
  const api = useApi();
  const router = useRouter();
  const pathname = usePathname();
  const listRoute = pathname.includes("/owner/")
    ? "/owner/notifications"
    : "/member/notifications";

  const { data: notifications = [] } = api.notification.query.get({ limit: 5 });
  const markAllRead = api.notification.mutate.markAllRead();

  const unreadCount = notifications.filter(
    (notification) => !notification.readAt,
  ).length;

  const handleSelect = (id: string) => {
    router.push(`${listRoute}/${id}`);
  };

  const handleMarkAllRead = () => {
    markAllRead.mutate();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative p-0">
          <Bell className="size-5" />
          {unreadCount > 0 && (
            <Badge className="absolute -right-1 -top-1 h-4 min-w-4 rounded-full px-1 text-[10px] font-bold">
              {unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel className="flex items-center justify-between gap-2">
          <span className="font-serif text-base font-semibold">Notifikasi</span>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 px-2 text-xs"
            onClick={handleMarkAllRead}
            disabled={unreadCount === 0 || markAllRead.isPending}
          >
            Tandai semua dibaca
          </Button>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        {notifications.length === 0 ? (
          <div className="px-4 py-8 text-center text-sm text-muted-foreground">
            Tidak ada notifikasi
          </div>
        ) : (
          notifications.map((notification) => (
            <DropdownMenuItem
              key={notification.id}
              onClick={() => handleSelect(notification.id)}
              className="flex cursor-pointer items-start gap-3 py-3"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span
                    className={`truncate text-sm font-semibold ${
                      !notification.readAt ? "text-primary" : "text-foreground"
                    }`}
                  >
                    {notification.title}
                  </span>
                  {!notification.readAt && (
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                  )}
                </div>
                <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">
                  {notification.body}
                </p>
                <span className="mt-1 block text-[11px] text-muted-foreground/70">
                  {formatDateTime(notification.createdAt)}
                </span>
              </div>
            </DropdownMenuItem>
          ))
        )}

        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => router.push(listRoute)}
          className="cursor-pointer justify-center py-2 text-sm font-medium text-primary"
        >
          Lihat Semua
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
