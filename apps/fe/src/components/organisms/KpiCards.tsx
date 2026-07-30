import { CalendarCheck, Clock, GraduationCap, Users } from "lucide-react";

import {
  Badge,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Progress,
} from "@/components/atoms";
import { GlassCard } from "@/components/molecules/GlassCard";

const kpis = [
  {
    icon: Users,
    label: "Utilisasi Kursi",
    value: "32 / 40",
    detail: <Progress value={32} max={40} className="mt-2 h-1.5" />,
    badge: "80% terpakai",
    badgeVariant: "default" as const,
  },
  {
    icon: GraduationCap,
    label: "Tingkat Produktivitas",
    value: "88.4%",
    badge: "+5.2% minggu lalu",
    badgeVariant: "default" as const,
  },
  {
    icon: CalendarCheck,
    label: "Kesehatan Tugas",
    value: "142 Aktif",
    detail: (
      <p className="mt-1 text-xs text-muted-foreground">
        <span className="font-medium text-destructive">12 Overdue</span>
      </p>
    ),
    badge: "92% on-track",
    badgeVariant: "secondary" as const,
  },
  {
    icon: Clock,
    label: "Total Deep Work",
    value: "420 Jam",
    badge: "Minggu ini",
    badgeVariant: "outline" as const,
  },
];

export function KpiCards() {
  return (
    <>
      {kpis.map((kpi) => (
        <GlassCard key={kpi.label}>
          <CardHeader className="flex-row items-center gap-3 space-y-0 px-5 pt-5 pb-2">
            <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <kpi.icon className="size-5" />
            </div>
            <CardDescription className="text-xs font-medium uppercase tracking-wider text-muted-foreground/70">
              {kpi.label}
            </CardDescription>
          </CardHeader>
          <CardContent className="px-5 pb-5">
            <div className="flex items-baseline justify-between">
              <CardTitle className="text-2xl font-bold tracking-tight">
                {kpi.value}
              </CardTitle>
              <Badge
                variant={kpi.badgeVariant}
                className="rounded-full px-2.5 py-0.5 text-[10px] font-medium"
              >
                {kpi.badge}
              </Badge>
            </div>
            {kpi.detail}
          </CardContent>
        </GlassCard>
      ))}
    </>
  );
}
