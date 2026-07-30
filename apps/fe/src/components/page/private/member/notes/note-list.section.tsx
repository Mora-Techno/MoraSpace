import { format } from "date-fns";
import { Plus, Trash2 } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/atoms";
import { GhibliCard } from "@/components/molecules/GhibliCard";
import { GhibliEmptyState } from "@/components/template/GhibliEmptyState";
import { cn } from "@/utils/classname";
import type { Note } from "@repo/types";

interface NoteListSectionProps {
  service: {
    handleCreate: () => void;
    handleDelete: (id: string) => void;
    handleSelect: (id: string) => void;
  };
  state: {
    notes: Note[];
    isLoading: boolean;
    activeId?: string;
    showModal: boolean;
    setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
    gridRef: React.RefObject<HTMLDivElement | null>;
  };
}

export function NoteListSection({ service, state }: NoteListSectionProps) {
  const { handleCreate, handleDelete, handleSelect } = service;
  const {
    notes,
    isLoading,
    // not show
    showModal,
    setShowModal,
    activeId,
    gridRef,
  } = state;

  return (
    <div className="space-y-4">
      <Button
        onClick={() => setShowModal(true)}
        className="ghibli-btn w-full sm:w-auto"
      >
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
          title="Belum ada catatan"
          description="Mulai menulis ide, jurnal, atau snippet kode pertamamu."
        />
      ) : (
        <div ref={gridRef} className="grid grid-cols-2 gap-3 md:grid-cols-1">
          {notes.map((note) => (
            <GhibliCard
              key={note.id}
              data-stagger-item
              className={cn(
                "cursor-pointer p-4",
                activeId === note.id && "ring-2 ring-primary/50",
              )}
              onClick={() => handleSelect(note.id)}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <h3 className="truncate font-serif font-medium">
                    {note.title}
                  </h3>
                  <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                    {note.content || "Kosong..."}
                  </p>
                  <p className="mt-2 text-[10px] text-muted-foreground">
                    {format(new Date(note.updatedAt), "d MMM yyyy")}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-7 shrink-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(note.id);
                  }}
                >
                  <Trash2 className="size-3.5 text-destructive" />
                </Button>
              </div>
              <Link
                href={`/notes/${note.id}`}
                className="sr-only"
                onClick={(e) => e.stopPropagation()}
              >
                Buka
              </Link>
            </GhibliCard>
          ))}
        </div>
      )}
    </div>
  );
}
