'use client';

import { format } from 'date-fns';
import { useState } from 'react';

import { Button } from '@/components/atoms';
import { GhibliCard } from '@/components/molecules/ghibli-card';
import { useCreateEvent } from '@/hooks/useApi/calendar';
import type { EventQuery } from '@/types/api/productivity';

export function EventFormSection({
  selectedDate,
  query,
}: {
  selectedDate?: Date;
  query?: EventQuery;
}) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const createEvent = useCreateEvent(query);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !startDate) return;
    createEvent.mutate(
      {
        title: title.trim(),
        description: description.trim() || undefined,
        startDate: new Date(startDate).toISOString(),
        query,
      },
      {
        onSuccess: () => {
          setTitle('');
          setDescription('');
          setStartDate('');
        },
      },
    );
  };

  return (
    <GhibliCard>
      <h2 className="font-serif text-lg font-semibold">Tambah Jadwal</h2>
      {selectedDate && (
        <p className="text-sm text-muted-foreground">
          Tanggal: {format(selectedDate, 'd MMMM yyyy')}
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
        <Button type="submit" className="ghibli-btn w-full" disabled={createEvent.isPending}>
          Simpan Jadwal
        </Button>
      </form>
    </GhibliCard>
  );
}
