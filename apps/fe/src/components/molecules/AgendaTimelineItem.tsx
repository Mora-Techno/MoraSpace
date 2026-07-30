import * as React from "react";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import { CalendarEvent } from "@repo/types";
import { CalendarDays } from "lucide-react";
import { Button } from "@/components/atoms";
import { cn } from "@/utils/classname";

interface AgendaTimelineItemProps {
  event: CalendarEvent;
  onJoinClick?: () => void;
}

export function AgendaTimelineItem({
  event,
  onJoinClick,
}: AgendaTimelineItemProps) {
  return (
    <div className="flex items-start gap-3 rounded-xl bg-background/50 px-3 py-3">
      <CalendarDays className="mt-0.5 size-4 shrink-0 text-primary" />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{event.title}</p>
        <p className="text-xs text-muted-foreground">
          {format(new Date(event.startDate), "EEEE, d MMM · HH:mm", {
            locale: idLocale,
          })}
        </p>
      </div>
      {onJoinClick && (
        <Button size="sm" variant="outline" onClick={onJoinClick}>
          Join
        </Button>
      )}
    </div>
  );
}
