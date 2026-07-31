"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/molecules/PageHeader";
import { useApi } from "@/hooks/useApi/useApi";
import { useGsapStagger } from "@/hooks/useGsapStagger";
import { NoteEditorSection } from "@/components/page/private/member/notes/note-editor.section";
import { NoteListSection } from "@/components/page/private/member/notes/note-list.section";
import { PickCreateNote } from "@repo";

export default function NotesContainer() {
  const api = useApi();

  const useNote = api.note.query.get();
  const { data: notes = [], isLoading } = useNote;
  const createNote = api.note.mutate.create();
  const deleteNote = api.note.mutate.delete();
  const updateNote = api.note.mutate.update();

  const [activeId, setActiveId] = useState<string | undefined>();
  const selectedId = activeId ?? notes[0]?.id;
  const gridRef = useGsapStagger<HTMLDivElement>([notes.length]);

  const { data: selectedNote, isLoading: isNoteLoading } =
    api.note.query.getByID(selectedId ?? "");

  const [formCreateNote, setFormCreateNote] = useState<PickCreateNote>({
    content: "",
    title: "",
  });
  const [showModal, setShowModal] = useState<boolean>(false);

  const handleSave = () => {
    if (!selectedId) return;
    const payload = formCreateNote;

    updateNote.mutate({
      id: { id: selectedId },
      payload,
    });
  };

  const handleModalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = formCreateNote;
    createNote.mutate(payload, {
      onSuccess: (res) => {
        const id = res.data.id;
        setShowModal(false);

        setActiveId(id);
      },
    });
  };

  const handleSelect = (id: string) => {
    setActiveId(id);
  };

  const handleDelete = (id: string) => {
    deleteNote.mutate(id);
  };

  return (
    <div className="animate-in fade-in duration-700">
      <PageHeader
        title="Notes"
        description="Simpan ide, jurnal harian, dan snippet kode."
      />
      <div className=" md:grid md:grid-cols-4 md:gap-6">
        <div className="md:col-span-1">
          <NoteListSection
            service={{
              handleDelete,
              handleSelect,
              handleSubmit: handleModalSubmit,
              isPending: createNote.isPending,
            }}
            state={{
              notes,
              setShowModal,
              formCreateNote,
              setFormCreateNote,
              showModal,
              isLoading,
              activeId,
              gridRef,
            }}
          />
        </div>
        <div className="md:col-span-3">
          {selectedId ? (
            <NoteEditorSection
              service={{ handleSave }}
              state={{
                note: selectedNote,
                isLoading: isNoteLoading,
                formCreateNote,
                setFormCreateNote,
                isPending: updateNote.isPending,
              }}
            />
          ) : (
            <div className="ghibli-glass flex min-h-100 items-center justify-center rounded-2xl p-8 text-muted-foreground">
              Pilih atau buat catatan untuk mulai menulis.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
