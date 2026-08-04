import { formatDateTime } from "@repo/utils/time-format";
import type { NotificationInApp } from "@repo/types";
import { MailOpen } from "lucide-react";
import { Button } from "@/components/atoms";
import { GhibliCard } from "@/components/molecules";

interface NotificationDetailSectionProps {
  service: {
    handleMarkRead: () => void;
  };
  state: {
    notification: NotificationInApp;
    isPending: boolean;
  };
}

export function NotificationDetailSection({
  service,
  state,
}: NotificationDetailSectionProps) {
  const { notification, isPending } = state;

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-4">
        <h2 className="text-xl font-bold text-foreground">Detail Notifikasi</h2>
      </div>

      <GhibliCard hover={false}>
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-border/50">
          <div className="space-y-2">
            <h3 className="text-2xl font-semibold text-foreground tracking-tight">
              {notification.title}
            </h3>
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                {formatDateTime(notification.createdAt)}
              </span>
              <span className="rounded-full bg-secondary px-2.5 py-0.5 text-xs font-semibold text-secondary-foreground uppercase">
                {notification.type}
              </span>
            </div>
          </div>

          <div className="flex flex-col items-end gap-2">
            {notification.readAt ? (
              <span className="text-xs font-medium text-muted-foreground/70 bg-muted px-3 py-1 rounded-full">
                Dibaca: {formatDateTime(notification.readAt)}
              </span>
            ) : (
              <Button
                onClick={service.handleMarkRead}
                disabled={isPending}
                size="sm"
                className="gap-2 rounded-full"
              >
                <MailOpen className="h-4 w-4" />
                <span>Tandai Dibaca</span>
              </Button>
            )}
          </div>
        </div>

        <div className="prose prose-sm dark:prose-invert max-w-none prose-p:leading-relaxed prose-pre:bg-muted/50 pb-8 min-h-[200px]">
          <p className="text-base text-foreground/90 whitespace-pre-wrap font-medium">
            {notification.body}
          </p>
        </div>
      </GhibliCard>
    </div>
  );
}
