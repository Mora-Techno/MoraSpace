import { CalendarClock, Trash2 } from "lucide-react";

import { Button } from "@/components/atoms";
import { Skeleton } from "@/components/atoms/Skeleton";
import { GhibliCard } from "@/components/molecules/GhibliCard";
import type { CalendarEvent, PickUpdateEvent } from "@repo/types";
import { formatDateTime } from "@repo";

interface EventDetailSectionProps {
  service: {
    handleSave: (e: React.FormEvent) => void;
    handleDelete: () => void;
  };
  state: {
    event: CalendarEvent | undefined;
    isLoading: boolean;
    isPending: boolean;
    form: PickUpdateEvent;
    setForm: React.Dispatch<React.SetStateAction<PickUpdateEvent>>;
  };
}

export function EventDetailSection({
  service,
  state,
}: EventDetailSectionProps) {
  const { handleSave, handleDelete } = service;
  const { event, isLoading, isPending, form, setForm } = state;

  if (isLoading) {
    return (
      <GhibliCard>
        <Skeleton className="h-8 w-1/2" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-24 w-full" />
      </GhibliCard>
    );
  }

  if (!event) {
    return (
      <GhibliCard>
        <p className="text-muted-foreground">Jadwal tidak ditemukan.</p>
      </GhibliCard>
    );
  }

  return (
    <div className="space-y-4">
      <GhibliCard hover={false}>
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <h2 className="font-serif text-xl font-semibold">{event.title}</h2>
            <div className="mt-4 space-y-1 text-sm text-muted-foreground">
              <p className="flex items-center gap-2">
                <CalendarClock className="size-4" />
                {formatDateTime(event.startDate)}
                {event.endDate && ` — ${formatDateTime(event.endDate)}`}
              </p>
              <p>Dibuat: {formatDateTime(event.createdAt)}</p>
              <p>Diperbarui: {formatDateTime(event.updatedAt)}</p>
            </div>
            {event.description && (
              <p className="mt-4 whitespace-pre-wrap rounded-xl bg-background/50 px-4 py-3 text-sm text-muted-foreground">
                {event.description}
              </p>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="size-9 shrink-0 text-destructive hover:bg-destructive/10"
            onClick={handleDelete}
            disabled={isPending}
          >
            <Trash2 className="size-4" />
          </Button>
        </div>
      </GhibliCard>

      <GhibliCard hover={false}>
        <h3 className="font-serif text-lg font-semibold">Edit Jadwal</h3>
        <form onSubmit={handleSave} className="mt-3 space-y-3">
          <input
            value={form.title ?? ""}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, title: e.target.value }))
            }
            placeholder="Judul jadwal..."
            className="w-full rounded-xl border border-input bg-background/80 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring"
          />
          <textarea
            value={form.description ?? ""}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, description: e.target.value }))
            }
            placeholder="Deskripsi (opsional)"
            rows={3}
            className="w-full resize-none rounded-xl border border-input bg-background/80 px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
          />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <input
              type="datetime-local"
              value={form.startDate ?? ""}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, startDate: e.target.value }))
              }
              className="w-full rounded-xl border border-input bg-background/80 px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
            <input
              type="datetime-local"
              value={form.endDate ?? ""}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  endDate: e.target.value || null,
                }))
              }
              className="w-full rounded-xl border border-input bg-background/80 px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div className="flex justify-end">
            <Button type="submit" className="ghibli-btn" disabled={isPending}>
              {isPending ? "Menyimpan..." : "Simpan Perubahan"}
            </Button>
          </div>
        </form>
      </GhibliCard>
    </div>
  );
}
