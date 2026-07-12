'use client';

import Link from 'next/link';

import { PageHeader } from '@/components/molecules/page-header';
import { useGsapStagger } from '@/hooks/useGsapStagger';

import { QuickAddFab } from '../_sections/quick-add.fab';
import { TodayTodosWidget } from '../_sections/today-todos.widget';
import { UpcomingEventsWidget } from '../_sections/upcoming-events.widget';

export default function DashboardContainer() {
  const gridRef = useGsapStagger<HTMLDivElement>([]);

  return (
    <div className="animate-in fade-in duration-700">
      <PageHeader
        title="Dashboard"
        description="Ringkasan produktivitasmu hari ini — seperti pagi di pedesaan Ghibli."
        action={<QuickAddFab />}
      />

      <div ref={gridRef} className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="md:col-span-1 lg:col-span-1" data-stagger-item>
          <TodayTodosWidget />
        </div>
        <div className="md:col-span-1 lg:col-span-1" data-stagger-item>
          <UpcomingEventsWidget />
        </div>
        <div
          className="ghibli-glass flex flex-col justify-center gap-3 p-6 md:col-span-2 lg:col-span-1"
          data-stagger-item
        >
          <span className="text-3xl">🎵</span>
          <h3 className="font-serif text-lg font-semibold">Mode Fokus</h3>
          <p className="text-sm text-muted-foreground">
            Putar musik Joe Hisaishi dan mulai sesi kerja yang tenang.
          </p>
          <Link
            href="/music"
            className="text-sm font-medium text-primary underline-offset-4 hover:underline"
          >
            Buka halaman Musik →
          </Link>
        </div>
      </div>
    </div>
  );
}
