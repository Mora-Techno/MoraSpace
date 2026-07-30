import * as React from "react";
import { GlassCard } from "@/components/molecules/GlassCard";
import { WidgetHeader } from "@/components/atoms/WidgetHeader";
import { FileEdit, SendHorizontal } from "lucide-react";
import { QuickNoteCard } from "@/components/molecules/QuickNoteCard";
import { Skeleton } from "@/components/atoms/Skeleton";
import { Button, Input } from "@/components/atoms";

interface QuickNotesSectionProps {
  service: {
    handleAdd: (e: React.FormEvent) => void;
    createNote: any;
  };
  state: {
    recentNotes: any[];
    isLoading: boolean;
    newTitle: string;
    setNewTitle: React.Dispatch<React.SetStateAction<string>>;
    newContent: string;
    setNewContent: React.Dispatch<React.SetStateAction<string>>;
  };
}

export function QuickNotesSection({ service, state }: QuickNotesSectionProps) {
  const { handleAdd, createNote } = service;
  const {
    recentNotes,
    isLoading,
    newTitle,
    setNewTitle,
    newContent,
    setNewContent,
  } = state;

  return (
    <GlassCard
      className="bg-amber-50/10 dark:bg-amber-950/20 p-6 flex flex-col h-[420px]"
      data-stagger-item
    >
      <WidgetHeader
        title="Catatan Pintas"
        icon={<FileEdit className="size-5" />}
      />

      <div className="flex-1 overflow-y-auto mb-4 space-y-3 pr-2">
        {isLoading ? (
          Array.from({ length: 2 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full rounded-xl" />
          ))
        ) : recentNotes.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center text-center text-muted-foreground opacity-70">
            <span className="text-4xl mb-2">📝</span>
            <p className="text-sm">
              Kosong. Catat ide yang terlintas secepat hembusan angin.
            </p>
          </div>
        ) : (
          recentNotes.map((note: any) => (
            <QuickNoteCard key={note.id} note={note} onClick={() => {}} />
          ))
        )}
      </div>

      <form
        onSubmit={handleAdd}
        className="mt-auto flex flex-col gap-2 rounded-xl bg-background/40 p-3 ring-1 ring-border/50"
      >
        <Input
          placeholder="Judul catatan..."
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          className="bg-transparent h-8 border-none focus-visible:ring-0 px-1 font-medium placeholder:text-muted-foreground/60 text-sm"
          disabled={createNote.isPending}
        />
        <div className="flex items-end gap-2">
          <Input
            placeholder="Tulis idemu disini..."
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
            className="flex-1 bg-transparent h-8 border-none focus-visible:ring-0 px-1 text-sm"
            disabled={createNote.isPending}
          />
          <Button
            type="submit"
            size="sm"
            variant="ghost"
            className="h-8 w-8 p-0 text-primary hover:text-primary hover:bg-primary/20 shrink-0"
            disabled={
              createNote.isPending || !newTitle.trim() || !newContent.trim()
            }
          >
            <SendHorizontal className="size-4" />
          </Button>
        </div>
      </form>
    </GlassCard>
  );
}
