"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import { Button } from "@/components/atoms";
import { PageHeader } from "@/components/molecules/PageHeader";
import { NoteEditorSection } from "@/components/page/private/member/notes/note-editor.section";
import { useApi } from "@/hooks/useApi/useApi";
import { PickCreateNote } from "@repo";

export default function NoteDetailContainer({ id }: { id: string }) {
  const api = useApi();
  const { data: note, isLoading } = api.note.query.getByID(id);
  const updateNote = api.note.mutate.update();
  const [formCreateNote, setFormCreateNote] = useState<PickCreateNote>({
    content: "",
    title: "",
  });

  useEffect(() => {
    if (note) {
      setFormCreateNote((prev) => ({
        ...prev,
        content: note.content,
      }));
      setFormCreateNote((prev) => ({
        ...prev,
        title: note.title,
      }));
    }
  }, [note]);

  const handleSave = () => {
    const payload = formCreateNote;
    if (!id) return;
    updateNote.mutate({
      id: { id },
      payload,
    });
  };

  return (
    <div className="animate-in fade-in duration-700">
      <PageHeader
        title="Editor Catatan"
        action={
          <Button variant="outline" size="sm" asChild className="ghibli-btn">
            <Link href="/notes">
              <ArrowLeft className="size-4" /> Kembali
            </Link>
          </Button>
        }
      />
      <NoteEditorSection
        service={{ handleSave }}
        state={{
          note,
          isLoading,
          formCreateNote,
          setFormCreateNote,
          isPending: updateNote.isPending,
        }}
      />
    </div>
  );
}
