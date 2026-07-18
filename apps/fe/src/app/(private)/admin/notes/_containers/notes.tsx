'use client';

import { useState } from 'react';

import { PageHeader } from '@/components/molecules/page-header';
import { useIsMobile } from '@/hooks/use-mobile';
import { useNotes } from '@/hooks/useApi/note';

import { NoteEditorSection } from '../_sections/note-editor.section';
import { NoteListSection } from '../_sections/note-list.section';

export default function NotesContainer() {
  const isMobile = useIsMobile();
  const { data: notes = [] } = useNotes();
  const [activeId, setActiveId] = useState<string | undefined>();

  const selectedId = activeId ?? notes[0]?.id;

  return (
    <div className="animate-in fade-in duration-700">
      <PageHeader title="Notes" description="Simpan ide, jurnal harian, dan snippet kode." />

      {isMobile ? (
        <NoteListSection />
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <NoteListSection activeId={selectedId} onSelect={setActiveId} />
          </div>
          <div className="lg:col-span-3">
            {selectedId ? (
              <NoteEditorSection noteId={selectedId} />
            ) : (
              <div className="ghibli-glass flex min-h-[400px] items-center justify-center rounded-2xl p-8 text-muted-foreground">
                Pilih atau buat catatan untuk mulai menulis.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
