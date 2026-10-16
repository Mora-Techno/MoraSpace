'use client';

import { PickCreateNote } from '@repo';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

import { DetailShell } from '@/components/molecules/DetailShell';
import { NoteEditorSection } from '@/components/page/private/member/notes/note-editor.section';
import { useApi } from '@/hooks/useApi/useApi';

export default function NoteDetailContainer({ id }: { id: string }) {
  const api = useApi();
  const pathname = usePathname();
  const listRoute = pathname.includes('/owner/') ? '/owner/notes' : '/member/notes';
  const { data: note, isLoading } = api.note.query.getByID(id);
  const updateNote = api.note.mutate.update();
  const [formCreateNote, setFormCreateNote] = useState<PickCreateNote>({
    content: '',
    title: '',
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
    <DetailShell title="Editor Catatan" backHref={listRoute} isLoading={isLoading}>
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
    </DetailShell>
  );
}
