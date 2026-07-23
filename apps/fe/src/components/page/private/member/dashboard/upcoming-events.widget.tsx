'use client';

import { format } from 'date-fns';
import { id as idLocale } from 'date-fns/locale';
import { ArrowRight, CalendarDays } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/atoms';
import { GhibliCard } from '@/components/molecules/ghibli-card';
import { GhibliEmptyState } from '@/components/template/ghibli-empty-state';
import { useEvents } from '@/hooks/useApi/calendar';

export function UpcomingEventsWidget() {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const year = String(now.getFullYear());
  const { data: events = [], isLoading } = useEvents({ month, year });

  const upcoming = events
    .filter((e) => new Date(e.startDate) >= now)
    .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
    .slice(0, 3);

  return (
    <GhibliCard>
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-lg font-semibold">Jadwal Terdekat</h2>
        <Button variant="ghost" size="sm" asChild className="ghibli-btn">
          <Link href="/calendar">
            Kalender <ArrowRight className="size-4" />
          </Link>
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <div key={i} className="h-14 animate-pulse rounded-xl bg-muted" />
          ))}
        </div>
      ) : upcoming.length === 0 ? (
        <GhibliEmptyState
          emoji="🌙"
          title="Tidak ada jadwal mendatang"
          description="Hari ini tenang — nikmati angin sepoi-sepoi."
        />
      ) : (
        <ul className="space-y-2">
          {upcoming.map((event) => (
            <li
              key={event.id}
              data-stagger-item
              className="flex items-start gap-3 rounded-xl bg-background/50 px-3 py-3"
            >
              <CalendarDays className="mt-0.5 size-4 shrink-0 text-primary" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{event.title}</p>
                <p className="text-xs text-muted-foreground">
                  {format(new Date(event.startDate), 'EEEE, d MMM · HH:mm', {
                    locale: idLocale,
                  })}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </GhibliCard>
  );
}
