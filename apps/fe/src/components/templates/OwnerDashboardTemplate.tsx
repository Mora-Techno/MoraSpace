'use client';

import type { ReactNode } from 'react';

interface OwnerDashboardTemplateProps {
  gridRef: React.RefObject<HTMLDivElement | null>;
  kpiCards: ReactNode;
  taskDistributionChart: ReactNode;
  billingWidget: ReactNode;
  activityFeedWidget: ReactNode;
}

export function OwnerDashboardTemplate({
  gridRef,
  kpiCards,
  taskDistributionChart,
  billingWidget,
  activityFeedWidget,
}: OwnerDashboardTemplateProps) {
  return (
    <section className="w-full min-h-screen pb-12">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Command Center</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Ringkasan eksekutif perusahaan Anda — real-time, berbasis data.
        </p>
      </div>

      {/* Bento Grid */}
      <div
        ref={gridRef}
        className="mx-auto grid max-w-full grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4"
      >
        {/* Row 1 — KPI Cards (4 cols) */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:col-span-4 lg:grid-cols-4">
          {kpiCards}
        </div>

        {/* Row 2 — Charts + Billing */}
        <div className="lg:col-span-3 lg:row-span-1" data-stagger-item>
          {taskDistributionChart}
        </div>
        <div className="lg:col-span-1" data-stagger-item>
          {billingWidget}
        </div>

        {/* Row 3 — Activity Feed (full width) */}
        <div className="lg:col-span-4" data-stagger-item>
          {activityFeedWidget}
        </div>
      </div>
    </section>
  );
}
