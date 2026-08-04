import type { Note, PickCreateNote } from "@repo/types";
import { FileEdit, Plus, Save } from "lucide-react";

import { Button, Input, Textarea } from "@/components/atoms";
import { Skeleton } from "@/components/atoms/Skeleton";
import { WidgetHeader } from "@/components/atoms/WidgetHeader";
import { GlassCard } from "@/components/molecules/GlassCard";
import { QuickNoteCard } from "@/components/molecules/QuickNoteCard";
import type {
  useCreateNote,
  useUpdateNote,
} from "@/hooks/useApi/note/state/mutate";
import { AlertContexType } from "@/types/ui";
import EditNoteDialog from "../molecules/modal/EditNoteModal";
import QuickNoteModal from "../molecules/modal/QuickNotesModal";

interface QuickNotesSectionProps {
  service: {
    handleAdd: (e: React.FormEvent) => void;
    handleSaveEdit: (e: React.FormEvent) => void;
    handleDeleteNote: () => void;
    createNote: ReturnType<typeof useCreateNote>;
    updateNote: ReturnType<typeof useUpdateNote>;
  };
  state: {
    recentNotes: Note[];
    isLoading: boolean;
    showModalNotes: boolean;
    setShowModalNotes: React.Dispatch<React.SetStateAction<boolean>>;
    formCreateNote: PickCreateNote;
    setFormCreateNote: React.Dispatch<React.SetStateAction<PickCreateNote>>;
    selectedNote: Note | null;
    setSelectedNote: React.Dispatch<React.SetStateAction<Note | null>>;
    formEditNote: PickCreateNote;
    setFormEditNote: React.Dispatch<React.SetStateAction<PickCreateNote>>;
    alertType: AlertContexType;
  };
}

export function QuickNotesSection({ service, state }: QuickNotesSectionProps) {
  const {
    handleAdd,
    handleSaveEdit,
    handleDeleteNote,
    createNote,
    updateNote,
  } = service;
  const {
    recentNotes,
    isLoading,
    formCreateNote,
    setFormCreateNote,
    selectedNote,
    setSelectedNote,
    setShowModalNotes,
    showModalNotes,
    alertType,
    formEditNote,
    setFormEditNote,
  } = state;

  return (
    <GlassCard
      className="bg-amber-50/10 dark:bg-amber-950/20 p-6 flex flex-col h-105"
      data-stagger-item
    >
      <div className="w-full flex justify-between">
        <WidgetHeader
          title="Catatan Pintas"
          icon={<FileEdit className="size-5" />}
        />
        <Button
          size="sm"
          className="h-8 px-3 shrink-0"
          type="button"
          onClick={() => {
            setShowModalNotes(true);
          }}
        >
          <Plus className="size-4" />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto mb-4 space-y-3 pr-2">
        {isLoading ? (
          Array.from({ length: 2 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full rounded-xl" />
          ))
        ) : recentNotes.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center text-center text-muted-foreground opacity-70">
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
              alertType={alertType}
              handleDeleteNote={handleDeleteNote}
            />
          ))
        )}
      </div>

      <QuickNoteModal
        formCreateNote={formCreateNote}
        setFormCreateNote={setFormCreateNote}
        isPending={createNote.isPending}
        handleAdd={handleAdd}
        onOpenChange={setShowModalNotes}
        open={showModalNotes}
      />

      {selectedNote && (
        <EditNoteDialog
          formEditNote={formEditNote}
          handleSaveEdit={handleSaveEdit}
          setFormEditNote={setFormEditNote}
          isPending={updateNote.isPending}
          onOpenChange={(open) => {
            if (!open) setSelectedNote(null);
          }}
          open={selectedNote !== null}
        />
      )}
    </GlassCard>
  );
}
