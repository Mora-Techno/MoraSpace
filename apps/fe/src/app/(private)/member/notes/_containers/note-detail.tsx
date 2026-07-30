"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import { Button } from "@/components/atoms";
import { PageHeader } from "@/components/molecules/PageHeader";
import { NoteEditorSection } from "@/components/page/private/member/notes/note-editor.section";
import { useApi } from "@/hooks/useApi/useApi";

export default function NoteDetailContainer({ id }: { id: string }) {
  const api = useApi();
  const { data: note, isLoading } = api.note.query.getByID(id);
  const updateNote = api.note.mutate.update();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
    }
  }, [note]);

  const handleSave = () => {
    if (!id) return;
    updateNote.mutate({
      id: { id },
      payload: { title: title.trim(), content: content.trim() },
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
          title,
          setTitle,
          content,
          setContent,
          isPending: updateNote.isPending,
        }}
      />
    </div>
  );
}
