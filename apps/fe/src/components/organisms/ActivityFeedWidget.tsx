import {
  Avatar,
  AvatarFallback,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/atoms";
import { GlassCard } from "@/components/molecules/GlassCard";

interface ActivityLog {
  id: string;
  user: string;
  initials: string;
  action: string;
  timeAgo: string;
}

const activityLogs: ActivityLog[] = [
  {
    id: "1",
    user: "Budi Santoso",
    initials: "BS",
    action: "menyelesaikan milestone Fluxo App v2.0",
    timeAgo: "12 menit lalu",
  },
  {
    id: "2",
    user: "Siti Rahayu",
    initials: "SR",
    action: "mengundang 2 engineer baru ke Tim Backend",
    timeAgo: "28 menit lalu",
  },
  {
    id: "3",
    user: "Dimas Prayoga",
    initials: "DP",
    action: "membuat campaign marketing Q3",
    timeAgo: "45 menit lalu",
  },
  {
    id: "4",
    user: "Ayu Lestari",
    initials: "AL",
    action: "menyetujui budget pembelian server senilai Rp 12.000.000",
    timeAgo: "1 jam lalu",
  },
  {
    id: "5",
    user: "Rina Wijaya",
    initials: "RW",
    action: "menyelesaikan sesi deep work — 2.5 jam",
    timeAgo: "2 jam lalu",
  },
  {
    id: "6",
    user: "System",
    initials: "SY",
    action: "Rencana pengisian ulang otomatis — Storage 72% terpakai",
    timeAgo: "3 jam lalu",
  },
  {
    id: "7",
    user: "Fajar Hidayat",
    initials: "FH",
    action: "bergabung ke Tim Product sebagai Product Designer",
    timeAgo: "5 jam lalu",
  },
];

export function ActivityFeedWidget() {
  return (
    <GlassCard>
      <CardHeader className="px-5 pt-5 pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-sm font-semibold">
              Aktivitas Perusahaan
            </CardTitle>
            <CardDescription className="text-xs">
              Feed real-time aktivitas tim
            </CardDescription>
          </div>
          <div className="flex items-center gap-1.5 rounded-full bg-success/10 px-2.5 py-1">
            <span className="size-1.5 animate-pulse rounded-full bg-success" />
            <span className="text-[10px] font-medium text-success">Live</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="max-h-[340px] space-y-1 overflow-y-auto px-5 pb-5">
        {activityLogs.map((log, idx) => (
          <div key={log.id} className="relative">
            <div className="flex items-start gap-3 rounded-xl p-2.5 transition-colors hover:bg-muted/30">
              {idx < activityLogs.length - 1 && (
                <div className="absolute left-6 top-10 bottom-0 w-px bg-border/50" />
              )}
              <Avatar className="size-8 shrink-0 rounded-lg ring-1 ring-border/30">
                <AvatarFallback className="rounded-lg bg-muted text-[10px] font-medium text-muted-foreground">
                  {log.initials}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <p className="text-sm leading-snug text-foreground/85">
                  <span className="font-medium text-foreground">
                    {log.user}
                  </span>{" "}
                  {log.action}
                </p>
                <p className="mt-0.5 text-[10px] text-muted-foreground/60">
                  {log.timeAgo}
                </p>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </GlassCard>
  );
}
