import type { CalendarEvent } from '@repo/types';
import { format } from 'date-fns';
import { id as idLocale } from 'date-fns/locale';
import { CalendarDays } from 'lucide-react';

import { Button } from '@/components/atoms';

interface AgendaTimelineItemProps {
  event: CalendarEvent;
  onJoinClick?: () => void;
}

export function AgendaTimelineItem({ event, onJoinClick }: AgendaTimelineItemProps) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-border/40 bg-card/65 px-3.5 py-3 transition-all duration-200 hover:border-border/70 hover:bg-card/90 hover:shadow-2xs">
      <CalendarDays className="mt-0.5 size-4 shrink-0 text-primary" />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-foreground">{event.title}</p>
        <p className="text-xs text-muted-foreground/85 mt-0.5">
          {format(new Date(event.startDate), 'EEEE, d MMM · HH:mm', {
            locale: idLocale,
          })}
        </p>
      </div>
      {onJoinClick && (
        <Button size="sm" variant="outline" onClick={onJoinClick} className="h-7 text-xs px-2.5">
          Join
        </Button>
      )}
    </div>
  );
}
