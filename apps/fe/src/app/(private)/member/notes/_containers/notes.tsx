"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { PageHeader } from "@/components/molecules/PageHeader";
import { useApi } from "@/hooks/useApi/useApi";
import { useGsapStagger } from "@/hooks/useGsapStagger";

import { NoteEditorSection } from "@/components/page/private/member/notes/note-editor.section";
import { NoteListSection } from "@/components/page/private/member/notes/note-list.section";
import { PickCreateNote } from "@repo";
import { useAppNameSpace } from "@/hooks/useAppNameSpace";

export default function NotesContainer() {
  const router = useRouter();
  const api = useApi();
  const ns = useAppNameSpace();

  const useNote = api.note.query.get();
  const { data: notes = [], isLoading } = useNote;
  const createNote = api.note.mutate.create();
  const deleteNote = api.note.mutate.delete();
  const updateNote = api.note.mutate.update();

  const [activeId, setActiveId] = useState<string | undefined>();
  const selectedId = activeId ?? notes[0]?.id;
  const gridRef = useGsapStagger<HTMLDivElement>([notes.length]);

  // Selected note detail for editor
  const { data: selectedNote, isLoading: isNoteLoading } =
    api.note.query.getByID(selectedId ?? "");

  // Editor state
  const [editorTitle, setEditorTitle] = useState("");
  const [editorContent, setEditorContent] = useState("");

  const [formCreateNote, setFormCreateNote] = useState<PickCreateNote>({
    content: "",
    title: "",
  });
  const [showModal, setShowModal] = useState<boolean>(false);

  // Sync editor state when selected note changes
  useEffect(() => {
    if (selectedNote) {
      setEditorTitle(selectedNote.title);
      setEditorContent(selectedNote.content);
    }
  }, [selectedNote]);

  const handleSave = () => {
    if (!selectedId) return;
    updateNote.mutate({
      id: { id: selectedId },
      payload: {
        title: editorTitle.trim(),
        content: editorContent.trim(),
      },
    });
  };

  const handleCreate = () => {
    createNote.mutate(formCreateNote, {
      onSuccess: (res) => {
        const id = res.data.id;
        const isMobile = window.matchMedia("(max-width: 767px)").matches;
        if (isMobile) router.push(`/notes/${id}`);
        else {
          setActiveId(id);
          setEditorTitle("Catatan Baru");
          setEditorContent("");
        }
      },
    });
  };

  const handleSelect = (id: string) => {
    const isMobile = window.matchMedia("(max-width: 767px)").matches;
    if (isMobile) {
      router.push(`/notes/${id}`);
      return;
    }
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

      {/* Mobile: standalone list */}
      <div className="md:hidden">
        <NoteListSection
          service={{
            handleCreate,
            handleDelete,
            handleSelect,
          }}
          state={{
            notes,
            isLoading,
            setShowModal,
            showModal,
            activeId,
            gridRef,
          }}
        />
      </div>

      {/* Desktop: grid with list + editor */}
      <div className="hidden md:grid md:grid-cols-4 md:gap-6">
        <div className="md:col-span-1">
          <NoteListSection
            service={{
              handleCreate,
              handleDelete,
              handleSelect,
            }}
            state={{
              notes,
              setShowModal,
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
                title: editorTitle,
                setTitle: setEditorTitle,
                content: editorContent,
                setContent: setEditorContent,
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
