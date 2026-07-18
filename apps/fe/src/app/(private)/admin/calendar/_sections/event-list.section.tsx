'use client';

import { format, isSameDay } from 'date-fns';
import { id as idLocale } from 'date-fns/locale';
import { Trash2 } from 'lucide-react';

import { Button } from '@/components/atoms';
import { GhibliCard } from '@/components/molecules/ghibli-card';
import { GhibliEmptyState } from '@/components/template/ghibli-empty-state';
import { useDeleteEvent, useEvents } from '@/hooks/useApi/calendar';
import type { EventQuery } from '@/types/api/productivity';

export function EventListSection({
  selectedDate,
  query,
}: {
  selectedDate: Date;
  query?: EventQuery;
}) {
  const { data: events = [], isLoading } = useEvents(query);
  const deleteEvent = useDeleteEvent(query);

  const dayEvents = events.filter((e) => isSameDay(new Date(e.startDate), selectedDate));

  return (
    <GhibliCard>
      <h2 className="font-serif text-lg font-semibold">
        Agenda {format(selectedDate, 'd MMMM yyyy', { locale: idLocale })}
      </h2>

      {isLoading ? (
        <div className="space-y-2">
          {[1, 2].map((i) => (
            <div key={i} className="h-14 animate-pulse rounded-xl bg-muted" />
          ))}
        </div>
      ) : dayEvents.length === 0 ? (
        <GhibliEmptyState
          emoji="🌸"
          title="Tidak ada agenda"
          description="Hari ini bebas — tambahkan jadwal jika perlu."
        />
      ) : (
        <ul className="space-y-2">
          {dayEvents.map((event) => (
            <li
              key={event.id}
              className="flex items-start justify-between gap-3 rounded-xl bg-background/50 px-3 py-3"
            >
              <div>
                <p className="font-medium">{event.title}</p>
                <p className="text-xs text-muted-foreground">
                  {format(new Date(event.startDate), 'HH:mm', {
                    locale: idLocale,
                  })}
                  {event.description && ` · ${event.description}`}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="size-8"
                onClick={() => deleteEvent.mutate({ id: event.id, query })}
              >
                <Trash2 className="size-4 text-destructive" />
              </Button>
            </li>
          ))}
        </ul>
      )}
    </GhibliCard>
  );
}
