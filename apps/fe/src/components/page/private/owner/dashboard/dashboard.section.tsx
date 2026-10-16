'use client';

import { useGSAP } from '@gsap/react';
import type { OwnerDashboardOverview } from '@repo/types';
import { formatDistanceToNow } from 'date-fns';
import { id as idLocale } from 'date-fns/locale';
import gsap from 'gsap';
import { useRef } from 'react';

import { Button } from '@/components/atoms';
import { ActivityFeedWidget } from '@/components/organisms/ActivityFeedWidget';
import { BillingWidget } from '@/components/organisms/BillingWidget';
import { KpiCards } from '@/components/organisms/KpiCards';
import { TaskDistributionChart } from '@/components/organisms/TaskDistributionChart';
import { OwnerDashboardTemplate } from '@/components/templates/OwnerDashboardTemplate';

const FALLBACK_COLORS = ['#7DAF74', '#AEC6CF', '#F2C94C', '#D97757', '#9B8AFB', '#6FCF97'];

function formatDeepWork(minutes: number) {
  if (minutes >= 60) {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return m > 0 ? `${h} jam ${m} mnt` : `${h} Jam`;
  }
  return `${minutes} mnt`;
}

function initialsOf(name: string) {
  return (name ?? '')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');
}

interface OwnerDashboardSectionProps {
  service: {
    isLoading: boolean;
    isError: boolean;
    hasData: boolean;
    onRetry: () => void;
  };
  state: {
    overview: OwnerDashboardOverview | undefined;
  };
}

gsap.registerPlugin(useGSAP);

export function OwnerDashboardSection({ service, state }: OwnerDashboardSectionProps) {
  const gridRef = useRef<HTMLDivElement>(null);
  const { isLoading, isError, hasData, onRetry } = service;
  const { overview } = state;

  useGSAP(
    () => {
      const widgets = gridRef.current?.querySelectorAll('.gsap-widget');
      if (!widgets?.length) return;

      const tl = gsap.timeline({
        defaults: { ease: 'power3.out', duration: 0.6 },
      });

      tl.fromTo(
        widgets,
        { opacity: 0, y: 30, scale: 0.98 },
        { opacity: 1, y: 0, scale: 1, stagger: 0.1 },
      );
    },
    { scope: gridRef },
  );

  if (isLoading) {
    return (
      <section className="w-full min-h-screen pb-12">
        <div className="mb-6 h-8 w-56 animate-pulse rounded-lg bg-muted" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="h-32 animate-pulse rounded-2xl bg-muted/60" />
          ))}
        </div>
      </section>
    );
  }

  if (isError || !hasData || !overview) {
    return (
      <section className="w-full min-h-screen pb-12">
        <div className="rounded-2xl border border-border/60 p-10 text-center space-y-3">
          <p className="text-sm font-medium">Gagal memuat ringkasan.</p>
          <Button size="sm" variant="outline" onClick={onRetry}>
            Coba lagi
          </Button>
        </div>
      </section>
    );
  }

  const members = overview.members;
  const tasks = overview.tasks;
  const seatPct =
    members.maxMembers && members.maxMembers > 0
      ? Math.round((members.active / members.maxMembers) * 100)
      : null;
  const onTrack =
    tasks.total > 0 ? Math.round(((tasks.total - tasks.overdue) / tasks.total) * 100) : 100;

  return (
    <OwnerDashboardTemplate
      gridRef={{ current: null }}
      kpiCards={
        <KpiCards
          seats={{
            active: members.active,
            max: members.maxMembers,
            pctText: seatPct != null ? `${seatPct}% terpakai` : `${members.total} terdaftar`,
          }}
          done={{ rate: tasks.doneRate, completed: tasks.completed }}
          health={{ active: tasks.active, overdue: tasks.overdue, onTrack }}
          deepWork={{ text: formatDeepWork(overview.deepWorkMinutes) }}
        />
      }
      taskDistributionChart={
        <TaskDistributionChart
          data={tasks.byStatus.map((s, i) => ({
            name: s.name,
            value: s.count,
            color: s.color || FALLBACK_COLORS[i % FALLBACK_COLORS.length],
          }))}
          total={tasks.total}
        />
      }
      billingWidget={
        <BillingWidget
          plan={
            overview.plan
              ? {
                  tier: overview.plan.tier,
                  status: overview.plan.status,
                  renewsAtText: overview.plan.renewsAt
                    ? new Date(overview.plan.renewsAt).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })
                    : '–',
                }
              : null
          }
        />
      }
      activityFeedWidget={
        <ActivityFeedWidget
          items={overview.recentActivity.map((a) => ({
            id: a.id,
            actorName: a.actorName,
            initials: initialsOf(a.actorName),
            action: a.action,
            taskTitle: a.taskTitle,
            timeAgo: formatDistanceToNow(new Date(a.createdAt), {
              addSuffix: true,
              locale: idLocale,
            }),
          }))}
        />
      }
    />
  );
}

export default OwnerDashboardSection;
