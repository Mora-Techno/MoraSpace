'use client';

import type { NoteQuery, PickCreateNote } from '@repo/types';
import type { Dispatch, SetStateAction } from 'react';

import { PageHeader } from '@/components/molecules/PageHeader';
import { NoteListSection } from '@/components/page/private/member/notes/note-list.section';

interface NotesPageSectionProps {
  service: {
    handleDelete: (id: string) => void;
    handleSelect: (id: string) => void;
    handleSubmit: (e: React.FormEvent) => void;
    isPending: boolean;
    onSearch: (search: string) => void;
    onPageChange: (page: number) => void;
  };
  state: {
    notes: Parameters<typeof NoteListSection>[0]['state']['notes'];
    setShowModal: Dispatch<SetStateAction<boolean>>;
    formCreateNote: PickCreateNote;
    setFormCreateNote: Dispatch<SetStateAction<PickCreateNote>>;
    showModal: boolean;
    isLoading: boolean;
    gridRef: React.RefObject<HTMLDivElement | null>;
    query: NoteQuery;
  };
}

export function NotesPageSection({ service, state }: NotesPageSectionProps) {
  const { handleDelete, handleSelect, handleSubmit, isPending, onSearch, onPageChange } = service;
  const {
    notes,
    setShowModal,
    formCreateNote,
    setFormCreateNote,
    showModal,
    isLoading,
    gridRef,
    query,
  } = state;

  return (
    <div className="animate-in fade-in duration-700">
      <PageHeader title="Notes" description="Simpan ide, jurnal harian, dan snippet kode." />
      <div className="w-full">
        <NoteListSection
          service={{
            handleDelete,
            handleSelect,
            handleSubmit,
            isPending,
            onSearch,
            onPageChange,
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

export default NotesPageSection;
