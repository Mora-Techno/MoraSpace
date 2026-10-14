import type { OwnerDashboardOverview } from '@repo/types';
import { CalendarCheck, Clock, Target, Users } from 'lucide-react';

import {
  Badge,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Progress,
} from '@/components/atoms';
import { GlassCard } from '@/components/molecules/GlassCard';

function formatDeepWork(minutes: number) {
  if (minutes >= 60) {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return m > 0 ? `${h} jam ${m} mnt` : `${h} Jam`;
  }
  return `${minutes} mnt`;
}

export function KpiCards({ overview }: { overview?: OwnerDashboardOverview }) {
  const members = overview?.members;
  const tasks = overview?.tasks;
  const minutes = overview?.deepWorkMinutes ?? 0;

  const seatPct =
    members?.maxMembers && members.maxMembers > 0
      ? Math.round((members.active / members.maxMembers) * 100)
      : null;
  const onTrack =
    tasks && tasks.total > 0
      ? Math.round(((tasks.total - tasks.overdue) / tasks.total) * 100)
      : 100;

  const kpis = [
    {
      icon: Users,
      label: 'Utilisasi Kursi',
      value: members ? `${members.active} / ${members.maxMembers ?? '–'}` : '–',
      detail:
        members?.maxMembers != null ? (
          <Progress value={members.active} max={members.maxMembers} className="mt-2 h-1.5" />
        ) : undefined,
      badge: seatPct != null ? `${seatPct}% terpakai` : `${members?.total ?? 0} terdaftar`,
      badgeVariant: 'default' as const,
    },
    {
      icon: Target,
      label: 'Done Rate Tugas',
      value: tasks ? `${tasks.doneRate}%` : '–',
      detail: undefined,
      badge: tasks ? `${tasks.completed} selesai` : '–',
      badgeVariant: 'default' as const,
    },
    {
      icon: CalendarCheck,
      label: 'Kesehatan Tugas',
      value: tasks ? `${tasks.active} Aktif` : '–',
      detail: tasks ? (
        <p className="mt-1 text-xs text-muted-foreground">
          <span className="font-medium text-destructive">{tasks.overdue} Overdue</span>
        </p>
      ) : undefined,
      badge: tasks ? `${onTrack}% on-track` : '–',
      badgeVariant: 'secondary' as const,
    },
    {
      icon: Clock,
      label: 'Total Deep Work',
      value: formatDeepWork(minutes),
      detail: undefined,
      badge: '7 hari terakhir',
      badgeVariant: 'outline' as const,
    },
  ];

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
              <CardTitle className="text-2xl font-bold tracking-tight">{kpi.value}</CardTitle>
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
