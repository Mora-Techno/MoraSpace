import { format } from "date-fns";

import { Button } from "@/components/atoms";
import { GhibliCard } from "@/components/molecules/GhibliCard";

interface EventFormSectionProps {
  service: {
    handleSubmit: (e: React.FormEvent) => void;
  };
  state: {
    selectedDate?: Date;
    title: string;
    setTitle: (val: string) => void;
    description: string;
    setDescription: (val: string) => void;
    startDate: string;
    setStartDate: (val: string) => void;
    isPending: boolean;
  };
}

export function EventFormSection({ service, state }: EventFormSectionProps) {
  const { handleSubmit } = service;
  const {
    selectedDate,
    title,
    setTitle,
    description,
    setDescription,
    startDate,
    setStartDate,
    isPending,
  } = state;

  return (
    <GhibliCard>
      <h2 className="font-serif text-lg font-semibold">Tambah Jadwal</h2>
      {selectedDate && (
        <p className="text-sm text-muted-foreground">
          Tanggal: {format(selectedDate, "d MMMM yyyy")}
        </p>
      )}
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Judul jadwal"
          className="w-full rounded-xl border border-input bg-background/80 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring"
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Deskripsi (opsional)"
          rows={2}
          className="w-full resize-none rounded-xl border border-input bg-background/80 px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
        />
        <input
          type="datetime-local"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="w-full rounded-xl border border-input bg-background/80 px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
        />
        <Button
          type="submit"
          className="ghibli-btn w-full"
          disabled={isPending}
        >
          {isPending ? "Menyimpan..." : "Simpan Jadwal"}
        </Button>
      </form>
    </GhibliCard>
  );
}
