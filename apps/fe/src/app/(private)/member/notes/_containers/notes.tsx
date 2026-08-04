"use client";

import { useState } from "react";
import { PageHeader } from "@/components/molecules/PageHeader";
import { useApi } from "@/hooks/useApi/useApi";
import { useGsapStagger } from "@/hooks/useGsapStagger";
import { NoteListSection } from "@/components/page/private/member/notes/note-list.section";
import type { NoteQuery, PickCreateNote } from "@repo/types";
import { useRouter } from "next/navigation";

export default function NotesContainer() {
  const api = useApi();
  const router = useRouter();

  const [query, setQuery] = useState<NoteQuery>({
    page: 1,
    limit: 10,
    search: "",
  });

  const useNoteQuery = api.note.query.get(query);
  const { data: notes = [], isLoading } = useNoteQuery;
  const createNote = api.note.mutate.create();
  const deleteNote = api.note.mutate.delete();

  const gridRef = useGsapStagger<HTMLDivElement>([notes.length]);

  const [formCreateNote, setFormCreateNote] = useState<PickCreateNote>({
    content: "",
    title: "",
  });
  const [showModal, setShowModal] = useState<boolean>(false);

  const handleModalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = formCreateNote;
    createNote.mutate(payload, {
      onSuccess: (res) => {
        setShowModal(false);
        setFormCreateNote({ content: "", title: "" });
        router.push(`/member/notes/${res.data.id}`);
      },
    });
  };

  const handleSelect = (id: string) => {
    router.push(`/member/notes/${id}`);
  };

  const handleDelete = (id: string) => {
    deleteNote.mutate(id);
  };

  const handleSearch = (search: string) => {
    setQuery((prev) => ({ ...prev, search, page: 1 }));
  };

  const handlePageChange = (page: number) => {
    setQuery((prev) => ({ ...prev, page }));
  };

  return (
    <div className="animate-in fade-in duration-700">
      <PageHeader
        title="Notes"
        description="Simpan ide, jurnal harian, dan snippet kode."
      />
      <div className="w-full">
        <NoteListSection
          service={{
            handleDelete,
            handleSelect,
            handleSubmit: handleModalSubmit,
            isPending: createNote.isPending,
            onSearch: handleSearch,
            onPageChange: handlePageChange,
          }}
          state={{
            notes,
            setShowModal,
            formCreateNote,
            setFormCreateNote,
            showModal,
            isLoading,
            gridRef,
            query,
          }}
        />
      </div>
    </div>
  );
}
