'use client';

import { format } from 'date-fns';
import { Plus, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/atoms';
import { GhibliCard } from '@/components/molecules/ghibli-card';
import { GhibliEmptyState } from '@/components/template/ghibli-empty-state';
import { useIsMobile } from '@/hooks/use-mobile';
import { useCreateNote, useDeleteNote, useNotes } from '@/hooks/useApi/note';
import { useGsapStagger } from '@/hooks/useGsapStagger';
import { cn } from '@/utils/classname';

export function NoteListSection({
  activeId,
  onSelect,
}: {
  activeId?: string;
  onSelect?: (id: string) => void;
}) {
  const { data: notes = [], isLoading } = useNotes();
  const createNote = useCreateNote();
  const deleteNote = useDeleteNote();
  const isMobile = useIsMobile();
  const router = useRouter();
  const gridRef = useGsapStagger<HTMLDivElement>([notes.length]);

  const handleCreate = () => {
    createNote.mutate(
      { title: 'Catatan Baru', content: '' },
      {
        onSuccess: (res) => {
          const id = res.data.id;
          if (isMobile) router.push(`/notes/${id}`);
          else onSelect?.(id);
        },
      },
    );
  };

  const handleClick = (id: string) => {
    if (isMobile) {
      router.push(`/notes/${id}`);
      return;
    }
    onSelect?.(id);
  };

  return (
    <div className="space-y-4">
      <Button onClick={handleCreate} className="ghibli-btn w-full sm:w-auto">
        <Plus className="size-4" /> Catatan Baru
      </Button>

      {isLoading ? (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-1">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-24 animate-pulse rounded-2xl bg-muted" />
          ))}
        </div>
      ) : notes.length === 0 ? (
        <GhibliEmptyState
          emoji="📖"
          title="Belum ada catatan"
          description="Mulai menulis ide, jurnal, atau snippet kode pertamamu."
        />
      ) : (
        <div ref={gridRef} className="grid grid-cols-2 gap-3 md:grid-cols-1">
          {notes.map((note) => (
            <GhibliCard
              key={note.id}
              data-stagger-item
              className={cn('cursor-pointer p-4', activeId === note.id && 'ring-2 ring-primary/50')}
              onClick={() => handleClick(note.id)}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <h3 className="truncate font-serif font-medium">{note.title}</h3>
                  <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                    {note.content || 'Kosong...'}
                  </p>
                  <p className="mt-2 text-[10px] text-muted-foreground">
                    {format(new Date(note.updatedAt), 'd MMM yyyy')}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-7 shrink-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteNote.mutate(note.id);
                  }}
                >
                  <Trash2 className="size-3.5 text-destructive" />
                </Button>
              </div>
              {isMobile && (
                <Link
                  href={`/notes/${note.id}`}
                  className="sr-only"
                  onClick={(e) => e.stopPropagation()}
                >
                  Buka
                </Link>
              )}
            </GhibliCard>
          ))}
        </div>
      )}
    </div>
  );
}
