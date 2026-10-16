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

interface KpiCardsProps {
  seats: { active: number; max: number | null; pctText: string };
  done: { rate: number; completed: number };
  health: { active: number; overdue: number; onTrack: number };
  deepWork: { text: string };
}

export function KpiCards({ seats, done, health, deepWork }: KpiCardsProps) {
  const kpis = [
    {
      icon: Users,
      label: 'Utilisasi Kursi',
      value: `${seats.active} / ${seats.max ?? '–'}`,
      detail:
        seats.max != null ? (
          <Progress value={seats.active} max={seats.max} className="mt-2 h-1.5" />
        ) : undefined,
      badge: seats.pctText,
      badgeVariant: 'default' as const,
    },
    {
      icon: Target,
      label: 'Done Rate Tugas',
      value: `${done.rate}%`,
      detail: undefined,
      badge: `${done.completed} selesai`,
      badgeVariant: 'default' as const,
    },
    {
      icon: CalendarCheck,
      label: 'Kesehatan Tugas',
      value: `${health.active} Aktif`,
      detail: (
        <p className="mt-1 text-xs text-muted-foreground">
          <span className="font-medium text-destructive">{health.overdue} Overdue</span>
        </p>
      ),
      badge: `${health.onTrack}% on-track`,
      badgeVariant: 'secondary' as const,
    },
    {
      icon: Clock,
      label: 'Total Deep Work',
      value: deepWork.text,
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
