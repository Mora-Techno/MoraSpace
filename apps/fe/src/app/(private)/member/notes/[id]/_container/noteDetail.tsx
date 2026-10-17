'use client';

import type { PickCreateNote } from '@repo/types';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { DetailShell } from '@/components/molecules/DetailShell';
import { NoteEditorSection } from '@/components/page/private/member/notes/note-editor.section';
import { useApi } from '@/hooks/useApi/useApi';
import { deleteObject, uploadNoteImage } from '@/utils/r2-utils';

export default function NoteDetailContainer({ id }: { id: string }) {
  const api = useApi();
  const router = useRouter();
  const pathname = usePathname();
  const listRoute = pathname.includes('/owner/') ? '/owner/member/notes' : '/member/notes';
  const { data: note, isLoading } = api.note.query.getByID(id);
  const updateNote = api.note.mutate.update();
  const deleteNote = api.note.mutate.delete();

  const rawNote = note as any;
  const actualNote = rawNote?.data?.id
    ? rawNote.data
    : rawNote?.id
      ? rawNote
      : rawNote?.data?.data?.id
        ? rawNote.data.data
        : (rawNote?.data ?? rawNote);

  const [formCreateNote, setFormCreateNote] = useState<PickCreateNote>({
    content: '',
    title: '',
  });

  useEffect(() => {
    if (actualNote) {
      setFormCreateNote({
        content: actualNote.content || '',
        title: actualNote.title || '',
      });
    }
  }, [actualNote]);

  const handleSave = () => {
    if (!id) return;
    updateNote.mutate({
      id: { id },
      payload: formCreateNote,
    });
  };

  const handleDelete = () => {
    if (!id) return;
    if (window.confirm('Apakah kamu yakin ingin menghapus catatan ini?')) {
      deleteNote.mutate(id, {
        onSuccess: () => {
          router.push(listRoute);
        },
      });
    }
  };

  return (
    <DetailShell title="Catatan" backHref={listRoute} isLoading={isLoading}>
      <NoteEditorSection
        service={{
          handleSave,
          handleDelete,
          uploadNoteImage,
          deleteObject,
        }}
        state={{
          note: actualNote,
          isLoading,
          formCreateNote,
          setFormCreateNote,
          isPending: updateNote.isPending || deleteNote.isPending,
        }}
      />
    </DetailShell>
  );
}
