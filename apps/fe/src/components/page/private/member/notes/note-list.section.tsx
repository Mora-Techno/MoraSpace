import { ChevronLeft, ChevronRight, Plus, Search, Trash2 } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/atoms";
import { Input } from "@/components/atoms/Input";
import { GhibliCard } from "@/components/molecules/GhibliCard";
import { GhibliEmptyState } from "@/components/template/GhibliEmptyState";
import { NoteModal } from "@/components/molecules/modal/NoteModal";
import { cn } from "@/utils/classname";
import type { Note, NoteQuery, PickCreateNote } from "@repo/types";
import { formatDateOnly } from "@repo";

interface NoteListSectionProps {
  service: {
    handleDelete: (id: string) => void;
    handleSelect: (id: string) => void;
    isPending: boolean;
    handleSubmit: (e: React.FormEvent) => void;
    onSearch: (search: string) => void;
    onPageChange: (page: number) => void;
  };
  state: {
    notes: Note[];
    isLoading: boolean;
    activeId?: string;
    showModal: boolean;
    setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
    gridRef: React.RefObject<HTMLDivElement | null>;
    formCreateNote: PickCreateNote;
    setFormCreateNote: React.Dispatch<React.SetStateAction<PickCreateNote>>;
    query: NoteQuery;
  };
}

export function NoteListSection({ service, state }: NoteListSectionProps) {
  const {
    handleDelete,
    handleSelect,
    isPending,
    handleSubmit,
    onSearch,
    onPageChange,
  } = service;
  const {
    notes,
    isLoading,
    showModal,
    setShowModal,
    activeId,
    setFormCreateNote,

    gridRef,
    formCreateNote,
    query,
  } = state;

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Button
          onClick={() => setShowModal(true)}
          className="ghibli-btn w-full sm:w-auto"
        >
          <Plus className="size-4" /> Catatan Baru
        </Button>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Cari catatan..."
            value={query.search || ""}
            onChange={(e) => onSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <NoteModal
        open={showModal}
        onOpenChange={setShowModal}
        formCreateNote={formCreateNote}
        setFormCreateNote={setFormCreateNote}
        isPending={isPending}
        handleSubmit={handleSubmit}
      />

      {isLoading ? (
        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="h-40 animate-pulse rounded-2xl bg-muted" />
          ))}
        </div>
      ) : notes.length === 0 ? (
        <div className="mt-8">
          <GhibliEmptyState
            title="Belum ada catatan"
            description="Mulai menulis ide, jurnal, atau snippet kode pertamamu, atau coba kata kunci pencarian lain."
          />
        </div>
      ) : (
        <div className="mt-6">
          <div
            ref={gridRef}
            className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          >
            {notes.map((note) => (
              <GhibliCard
                key={note.id}
                data-stagger-item
                className={cn(
                  "flex min-h-[160px] cursor-pointer flex-col p-4 transition-all hover:shadow-lg",
                  activeId === note.id && "ring-2 ring-primary/50",
                )}
                onClick={() => handleSelect(note.id)}
              >
                <div className="flex flex-grow items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate font-serif text-lg font-medium">
                      {note.title}
                    </h3>
                    <p className="mt-2 line-clamp-3 break-words whitespace-pre-wrap text-sm text-muted-foreground">
                      {note.content || "Kosong..."}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-8 shrink-0 hover:bg-destructive/10"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(note.id);
                    }}
                  >
                    <Trash2 className="size-4 text-destructive" />
                  </Button>
                </div>
                <div className="mt-4 flex justify-between border-t border-border/50 pt-4 text-[11px] text-muted-foreground">
                  <span>{formatDateOnly(note.createdAt)}</span>
                </div>
                <Link
                  href={`/member/notes/${note.id}`}
                  className="sr-only"
                  onClick={(e) => e.stopPropagation()}
                >
                  Buka
                </Link>
              </GhibliCard>
            ))}
          </div>

          <div className="mt-8 flex justify-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange((query.page || 1) - 1)}
              disabled={(query.page || 1) <= 1}
            >
              <ChevronLeft />
            </Button>
            <div className="flex items-center px-4 text-sm font-medium">
              {query.page || 1}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange((query.page || 1) + 1)}
              disabled={notes.length < (query.limit || 10)}
            >
              <ChevronRight />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
