import { GlassCard } from "@/components/molecules/GlassCard";
import { WidgetHeader } from "@/components/atoms/WidgetHeader";
import { FileEdit, Save, SendHorizontal, Trash2 } from "lucide-react";
import { QuickNoteCard } from "@/components/molecules/QuickNoteCard";
import { Skeleton } from "@/components/atoms/Skeleton";
import { Button, Input, Textarea } from "@/components/atoms";
import type { Note, PickCreateNote } from "@repo/types";
import type {
  useCreateNote,
  useUpdateNote,
  useDeleteNote,
} from "@/hooks/useApi/note/state/mutate";

interface QuickNotesSectionProps {
  service: {
    handleAdd: (e: React.FormEvent) => void;
    handleSaveEdit: (e: React.FormEvent) => void;
    handleDeleteNote: () => void;
    createNote: ReturnType<typeof useCreateNote>;
    updateNote?: ReturnType<typeof useUpdateNote>;
    deleteNote?: ReturnType<typeof useDeleteNote>;
  };
  state: {
    recentNotes: Note[];
    isLoading: boolean;
    formCreateNote: PickCreateNote;
    setFormCreateNote: React.Dispatch<React.SetStateAction<PickCreateNote>>;
    selectedNote: Note | null;
    setSelectedNote: React.Dispatch<React.SetStateAction<Note | null>>;
    formEditNote: PickCreateNote;
    setFormEditNote: React.Dispatch<React.SetStateAction<PickCreateNote>>;
  };
}

export function QuickNotesSection({ service, state }: QuickNotesSectionProps) {
  const {
    handleAdd,
    handleSaveEdit,
    handleDeleteNote,
    createNote,
    updateNote,
    deleteNote,
  } = service;
  const {
    recentNotes,
    isLoading,
    formCreateNote,
    setFormCreateNote,
    selectedNote,
    setSelectedNote,
    formEditNote,
    setFormEditNote,
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
          recentNotes.map((note: Note) => (
            <QuickNoteCard
              key={note.id}
              note={note}
              onClick={() => setSelectedNote(note)}
            />
          ))
        )}
      </div>

      <form
        onSubmit={handleAdd}
        className="mt-auto flex flex-col gap-2 rounded-xl bg-background/40 p-3 ring-1 ring-border/50"
      >
        <Input
          placeholder="Judul catatan..."
          value={formCreateNote.title}
          onChange={(e) =>
            setFormCreateNote((prev) => ({ ...prev, title: e.target.value }))
          }
          className="bg-transparent h-8 border-none focus-visible:ring-0 px-1 font-medium placeholder:text-muted-foreground/60 text-sm"
          disabled={createNote.isPending}
        />
        <div className="flex items-end gap-2">
          <Input
            placeholder="Tulis idemu disini..."
            value={formCreateNote.content}
            onChange={(e) =>
              setFormCreateNote((prev) => ({
                ...prev,
                content: e.target.value,
              }))
            }
            className="flex-1 bg-transparent h-8 border-none focus-visible:ring-0 px-1 text-sm"
            disabled={createNote.isPending}
          />
          <Button
            type="submit"
            size="sm"
            variant="ghost"
            className="h-8 w-8 p-0 text-primary hover:text-primary hover:bg-primary/20 shrink-0"
            disabled={
              createNote.isPending ||
              !formCreateNote.title.trim() ||
              !formCreateNote.content.trim()
            }
          >
            <SendHorizontal className="size-4" />
          </Button>
        </div>
      </form>

      {selectedNote && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <form
            onSubmit={handleSaveEdit}
            className="mx-4 w-full max-w-lg overflow-hidden rounded-2xl border border-border/50 bg-background shadow-2xl"
          >
            {/* Modal header */}
            <div className="flex items-center justify-between border-b border-border/30 px-4 py-3">
              <div className="flex items-center gap-2">
                <FileEdit className="size-4 text-yellow-600" />
                <h3 className="text-sm font-medium">Edit Catatan</h3>
              </div>
              <div className="flex items-center gap-1">
                {deleteNote && (
                  <button
                    type="button"
                    onClick={handleDeleteNote}
                    className="flex size-7 items-center justify-center rounded-md text-muted-foreground hover:bg-muted/50 hover:text-destructive"
                    title="Hapus catatan"
                  >
                    <Trash2 className="size-4" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setSelectedNote(null)}
                  className="flex size-7 items-center justify-center rounded-md text-muted-foreground hover:bg-muted/50"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Modal body */}
            <div className="flex flex-col gap-3 p-4">
              <Input
                placeholder="Judul catatan..."
                value={formEditNote.title}
                onChange={(e) =>
                  setFormEditNote((prev) => ({
                    ...prev,
                    title: e.target.value,
                  }))
                }
                className="bg-transparent border-none focus-visible:ring-0 px-1 font-medium placeholder:text-muted-foreground/60 text-sm"
              />
              <Textarea
                placeholder="Tulis idemu disini..."
                value={formEditNote.content}
                onChange={(e) =>
                  setFormEditNote((prev) => ({
                    ...prev,
                    content: e.target.value,
                  }))
                }
                rows={5}
                className="bg-transparent border-none focus-visible:ring-0 px-1 text-sm resize-none"
              />
            </div>

            {/* Modal footer */}
            <div className="flex items-center justify-end gap-2 border-t border-border/30 px-4 py-3">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setSelectedNote(null)}
              >
                Batal
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={
                  updateNote?.isPending ||
                  !formEditNote.title.trim() ||
                  !formEditNote.content.trim()
                }
              >
                <Save className="size-4" />
                Simpan
              </Button>
            </div>
          </form>
        </div>
      )}
    </GlassCard>
  );
}
