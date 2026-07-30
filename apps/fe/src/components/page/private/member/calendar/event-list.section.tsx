import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import { Trash2 } from "lucide-react";

import { Button } from "@/components/atoms";
import { GhibliCard } from "@/components/molecules/GhibliCard";
import { GhibliEmptyState } from "@/components/template/GhibliEmptyState";
import type { CalendarEvent } from "@repo/types";
import type { PickApiID } from "@repo/types/api.types";

interface EventListSectionProps {
  service: {
    handleDelete: (id: PickApiID) => void;
  };
  state: {
    dayEvents: CalendarEvent[];
    isLoading: boolean;
    selectedDate: Date;
  };
}

export function EventListSection({ service, state }: EventListSectionProps) {
  const { handleDelete } = service;
  const { dayEvents, isLoading, selectedDate } = state;

  return (
    <GhibliCard>
      <h2 className="font-serif text-lg font-semibold">
        Agenda {format(selectedDate, "d MMMM yyyy", { locale: idLocale })}
      </h2>

      {isLoading ? (
        <div className="space-y-2">
          {[1, 2].map((i) => (
            <div key={i} className="h-14 animate-pulse rounded-xl bg-muted" />
          ))}
        </div>
      ) : dayEvents.length === 0 ? (
        <GhibliEmptyState
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
                  {format(new Date(event.startDate), "HH:mm", {
                    locale: idLocale,
                  })}
                  {event.description && ` · ${event.description}`}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="size-8"
                onClick={() => handleDelete({ id: event.id })}
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
