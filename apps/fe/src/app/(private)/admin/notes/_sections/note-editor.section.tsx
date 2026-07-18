'use client';

import { useEffect, useState } from 'react';

import { Button } from '@/components/atoms';
import { Skeleton } from '@/components/atoms/skeleton';
import { GhibliCard } from '@/components/molecules/ghibli-card';
import { useNote, useUpdateNote } from '@/hooks/useApi/note';

export function NoteEditorSection({ noteId }: { noteId: string }) {
  const { data: note, isLoading } = useNote(noteId);
  const updateNote = useUpdateNote();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
    }
  }, [note]);

  if (isLoading) {
    return (
      <GhibliCard>
        <Skeleton className="h-8 w-1/2" />
        <Skeleton className="h-40 w-full" />
      </GhibliCard>
    );
  }

  if (!note) {
    return (
      <GhibliCard>
        <p className="text-muted-foreground">Catatan tidak ditemukan.</p>
      </GhibliCard>
    );
  }

  const handleSave = () => {
    updateNote.mutate({
      id: noteId,
      payload: { title: title.trim(), content: content.trim() },
    });
  };

  return (
    <GhibliCard className="h-full min-h-[400px]">
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full border-none bg-transparent font-serif text-xl font-semibold outline-none"
        placeholder="Judul catatan"
      />
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={16}
        className="mt-4 w-full flex-1 resize-none rounded-xl border border-input bg-background/60 px-4 py-3 text-sm leading-relaxed outline-none focus:ring-2 focus:ring-ring"
        placeholder="Tulis catatanmu di sini..."
      />
      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={updateNote.isPending} className="ghibli-btn">
          Simpan Perubahan
        </Button>
      </div>
    </GhibliCard>
  );
}
