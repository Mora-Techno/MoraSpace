import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Search,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/atoms";
import { Input } from "@/components/atoms/Input";
import { GhibliCard } from "@/components/molecules/GhibliCard";
import { GhibliEmptyState } from "@/components/templates/GhibliEmptyState";
import type { CalendarEvent, EventQuery } from "@repo/types";
import type { PickApiID } from "@repo/types/api.types";
import { formatDateTime } from "@repo";

interface EventListSectionProps {
  service: {
    handleDelete: (id: PickApiID) => void;
    onSearch: (search: string) => void;
    onPageChange: (page: number) => void;
    handleSelect: (id: string) => void;
  };
  state: {
    events: CalendarEvent[];
    isLoading: boolean;
    isPending: boolean;
    query: EventQuery;
  };
}

export function EventListSection({ service, state }: EventListSectionProps) {
  const { handleDelete, onSearch, onPageChange, handleSelect } = service;
  const { events, isLoading, isPending, query } = state;

  return (
    <GhibliCard hover={false}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-serif text-lg font-semibold">Jadwal Kalender</h2>
          <p className="text-sm text-muted-foreground">
            Kelola agenda dan acara harianmu.
          </p>
        </div>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Cari jadwal..."
            value={query.search || ""}
            onChange={(e) => onSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="mt-4 space-y-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-14 animate-pulse rounded-xl bg-muted" />
          ))}
        </div>
      ) : events.length === 0 ? (
        <div className="mt-8">
          <GhibliEmptyState
            title="Belum ada jadwal"
            description="Jadwalkan agenda pertamamu atau coba kata kunci pencarian lain."
          />
        </div>
      ) : (
        <ul className="mt-4 space-y-2">
          {events.map((event) => (
            <li
              key={event.id}
              data-stagger-item
              className="flex cursor-pointer items-start justify-between gap-3 rounded-xl bg-background/50 px-3 py-3 transition-colors hover:bg-background/80"
              onClick={() => handleSelect(event.id)}
            >
              <div className="flex min-w-0 items-start gap-3">
                <div className="mt-0.5 shrink-0 rounded-lg bg-primary/10 p-2">
                  <CalendarDays className="size-4 text-primary" />
                </div>
                <div className="min-w-0">
                  <p className="truncate font-medium">{event.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatDateTime(event.startDate)}
                    {event.endDate && ` — ${formatDateTime(event.endDate)}`}
                  </p>
                  {event.description && (
                    <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                      {event.description}
                    </p>
                  )}
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="size-8 shrink-0 text-destructive"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete({ id: event.id });
                }}
                disabled={isPending}
              >
                <Trash2 className="size-4" />
              </Button>
            </li>
          ))}
        </ul>
      )}

      {!events.slice(0, 5) ? (
        <div className="mt-6 flex justify-center gap-2 border-t border-border/50 pt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange((query.page || 1) - 1)}
            disabled={(query.page || 1) <= 1}
          >
            <ChevronLeft />
          </Button>
          <div className="flex items-center px-4 text-sm font-medium">
            {query.page || 1}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange((query.page || 1) + 1)}
            disabled={events.length < (query.limit || 10)}
          >
            <ChevronRight />
          </Button>
        </div>
      ) : null}
    </GhibliCard>
  );
}
