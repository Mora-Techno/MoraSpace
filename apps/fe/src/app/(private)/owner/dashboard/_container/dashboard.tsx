'use client';

import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { useRef } from 'react';

import { Button } from '@/components/atoms';
import { ActivityFeedWidget } from '@/components/organisms/ActivityFeedWidget';
import { BillingWidget } from '@/components/organisms/BillingWidget';
import { KpiCards } from '@/components/organisms/KpiCards';
import { TaskDistributionChart } from '@/components/organisms/TaskDistributionChart';
import { OwnerDashboardTemplate } from '@/components/templates/OwnerDashboardTemplate';
import { useApi } from '@/hooks/useApi/useApi';

gsap.registerPlugin(useGSAP);

export default function OwnerDashboardContainer() {
  const gridRef = useRef<HTMLDivElement>(null);
  const api = useApi();
  const { data: overview, isLoading, isError, refetch } = api.dashboard.query.ownerOverview();

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

  if (isError || !overview) {
    return (
      <section className="w-full min-h-screen pb-12">
        <div className="rounded-2xl border border-border/60 p-10 text-center space-y-3">
          <p className="text-sm font-medium">Gagal memuat ringkasan.</p>
          <Button size="sm" variant="outline" onClick={() => refetch()}>
            Coba lagi
          </Button>
        </div>
      </section>
    );
  }

  return (
    <OwnerDashboardTemplate
      gridRef={gridRef}
      kpiCards={<KpiCards overview={overview} />}
      taskDistributionChart={<TaskDistributionChart slices={overview.tasks.byStatus} />}
      billingWidget={<BillingWidget plan={overview.plan} />}
      activityFeedWidget={<ActivityFeedWidget items={overview.recentActivity} />}
    />
  );
}
