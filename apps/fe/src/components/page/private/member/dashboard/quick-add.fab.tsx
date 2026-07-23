'use client';

import { CheckSquare, FileText, Plus } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/atoms';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/atoms/dialog';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/atoms/sheet';
import { useIsMobile } from '@/hooks/use-mobile';
import { useCreateNote } from '@/hooks/useApi/note';
import { useCreateTodo } from '@/hooks/useApi/todo';
import { cn } from '@/utils/classname';

function QuickAddForm() {
  const [mode, setMode] = useState<'todo' | 'note'>('todo');
  const [todoText, setTodoText] = useState('');
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const createTodo = useCreateTodo();
  const createNote = useCreateNote();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'todo' && todoText.trim()) {
      createTodo.mutate({ text: todoText.trim() }, { onSuccess: () => setTodoText('') });
      return;
    }
    if (mode === 'note' && noteTitle.trim() && noteContent.trim()) {
      createNote.mutate(
        { title: noteTitle.trim(), content: noteContent.trim() },
        {
          onSuccess: () => {
            setNoteTitle('');
            setNoteContent('');
          },
        },
      );
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex gap-2">
        <Button
          type="button"
          variant={mode === 'todo' ? 'default' : 'outline'}
          size="sm"
          className="ghibli-btn flex-1"
          onClick={() => setMode('todo')}
        >
          <CheckSquare className="size-4" /> Todo
        </Button>
        <Button
          type="button"
          variant={mode === 'note' ? 'default' : 'outline'}
          size="sm"
          className="ghibli-btn flex-1"
          onClick={() => setMode('note')}
        >
          <FileText className="size-4" /> Note
        </Button>
      </div>

      {mode === 'todo' ? (
        <input
          value={todoText}
          onChange={(e) => setTodoText(e.target.value)}
          placeholder="Apa yang ingin kamu kerjakan?"
          className="w-full rounded-xl border border-input bg-background/80 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring"
        />
      ) : (
        <div className="space-y-3">
          <input
            value={noteTitle}
            onChange={(e) => setNoteTitle(e.target.value)}
            placeholder="Judul catatan"
            className="w-full rounded-xl border border-input bg-background/80 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring"
          />
          <textarea
            value={noteContent}
            onChange={(e) => setNoteContent(e.target.value)}
            placeholder="Tulis ide, jurnal, atau snippet..."
            rows={4}
            className="w-full resize-none rounded-xl border border-input bg-background/80 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
      )}

      <Button
        type="submit"
        className="ghibli-btn w-full"
        disabled={createTodo.isPending || createNote.isPending}
      >
        Simpan
      </Button>
    </form>
  );
}

export function QuickAddFab() {
  const isMobile = useIsMobile();
  const title = 'Tambah Cepat';

  if (isMobile) {
    return (
      <Sheet>
        <SheetTrigger asChild>
          <Button
            size="icon"
            className={cn(
              'ghibli-btn fixed right-4 bottom-20 z-40 size-14 rounded-full shadow-lg md:hidden',
            )}
          >
            <Plus className="size-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="bottom" className="rounded-t-3xl">
          <SheetHeader>
            <SheetTitle className="font-serif">{title}</SheetTitle>
          </SheetHeader>
          <div className="px-4 pb-6">
            <QuickAddForm />
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="ghibli-btn hidden md:inline-flex">
          <Plus className="size-4" /> Quick Add
        </Button>
      </DialogTrigger>
      <DialogContent className="ghibli-glass sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-serif">{title}</DialogTitle>
        </DialogHeader>
        <QuickAddForm />
      </DialogContent>
    </Dialog>
  );
}
