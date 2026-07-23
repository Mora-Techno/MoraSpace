'use client';

import { useState } from 'react';

import { Button } from '@/components/atoms';
import { GhibliCard } from '@/components/molecules/ghibli-card';
import { useCreateTodo } from '@/hooks/useApi/todo';

export function TodoFormSection({
  filters,
}: {
  filters?: { status?: 'pending' | 'completed' };
}) {
  const [text, setText] = useState('');
  const [dueDate, setDueDate] = useState('');
  const createTodo = useCreateTodo(filters);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    createTodo.mutate(
      {
        text: text.trim(),
        ...(dueDate && { dueDate: new Date(dueDate).toISOString() }),
      },
      {
        onSuccess: () => {
          setText('');
          setDueDate('');
        },
      },
    );
  };

  return (
    <GhibliCard className="h-fit">
      <h2 className="font-serif text-lg font-semibold">Tugas Baru</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Tulis tugas baru..."
          className="w-full rounded-xl border border-input bg-background/80 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring"
        />
        <input
          type="datetime-local"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="w-full rounded-xl border border-input bg-background/80 px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
        />
        <Button type="submit" className="ghibli-btn w-full" disabled={createTodo.isPending}>
          Tambah Tugas
        </Button>
      </form>
    </GhibliCard>
  );
}
