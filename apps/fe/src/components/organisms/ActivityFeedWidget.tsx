import {
  Avatar,
  AvatarFallback,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/atoms';
import { GlassCard } from '@/components/molecules/GlassCard';

interface ActivityItem {
  id: string;
  actorName: string;
  initials: string;
  action: string;
  taskTitle: string;
  timeAgo: string;
}

export function ActivityFeedWidget({ items = [] }: { items?: ActivityItem[] }) {
  return (
    <GlassCard>
      <CardHeader className="px-5 pt-5 pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-sm font-semibold">Aktivitas Perusahaan</CardTitle>
            <CardDescription className="text-xs">Aktivitas tugas terbaru tim</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="max-h-[340px] space-y-1 overflow-y-auto px-5 pb-5">
        {items.length === 0 && (
          <p className="py-8 text-center text-xs text-muted-foreground">Belum ada aktivitas.</p>
        )}
        {items.map((log, idx) => (
          <div key={log.id} className="relative">
            <div className="flex items-start gap-3 rounded-xl p-2.5 transition-colors hover:bg-muted/30">
              {idx < items.length - 1 && (
                <div className="absolute left-6 top-10 bottom-0 w-px bg-border/50" />
              )}
              <Avatar className="size-8 shrink-0 rounded-lg ring-1 ring-border/30">
                <AvatarFallback className="rounded-lg bg-muted text-[10px] font-medium text-muted-foreground">
                  {log.initials}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <p className="text-sm leading-snug text-foreground/85">
                  <span className="font-medium text-foreground">{log.actorName}</span> {log.action}
                  {log.taskTitle ? (
                    <>
                      {' — '}
                      <span className="text-muted-foreground">{log.taskTitle}</span>
                    </>
                  ) : null}
                </p>
                <p className="mt-0.5 text-[10px] text-muted-foreground/60">{log.timeAgo}</p>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </GlassCard>
  );
}
