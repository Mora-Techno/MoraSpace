'use client';

import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/atoms';
import { PageHeader } from '@/components/molecules/page-header';

import { NoteEditorSection } from '../_sections/note-editor.section';

export default function NoteDetailContainer({ id }: { id: string }) {
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
      <NoteEditorSection noteId={id} />
    </div>
  );
}
