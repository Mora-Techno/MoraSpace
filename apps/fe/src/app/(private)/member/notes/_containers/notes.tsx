'use client';

import type { NoteQuery, PickCreateNote } from '@repo/types';
import type { IModule, PickCreateModule, PickUpdateModule } from '@repo/types/module.types';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useMemo, useState } from 'react';

import { NotesPageSection } from '@/components/page/private/member/notes/notes-page.section';
import { useApi } from '@/hooks/useApi/useApi';
import { useGsapStagger } from '@/hooks/useGsapStagger';
import { useWorkspaceSwitcher } from '@/hooks/useWorkspace';

interface NotesContainerProps {
  moduleId?: string;
}

export default function NotesContainer({ moduleId: propModuleId }: NotesContainerProps = {}) {
  const api = useApi();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const moduleId = propModuleId ?? searchParams.get('moduleId');
  const basePath = pathname.includes('/owner/') ? '/owner/member/notes' : '/member/notes';

  const { isPersonalActive, currentWorkspaceRole } = useWorkspaceSwitcher();
  const canManageModules =
    isPersonalActive || currentWorkspaceRole === 'Owner' || currentWorkspaceRole === 'Admin';

  const { data: modules = [], isLoading: isLoadingModules } = api.module.query.get({
    type: 'NOTE',
  });
  const activeModule = useMemo(
    () => modules.find((m: IModule) => m.id === moduleId) ?? null,
    [modules, moduleId],
  );

  const [filterQuery, setFilterQuery] = useState<NoteQuery>({
    page: 1,
    limit: 10,
    search: '',
  });

  const query: NoteQuery = {
    ...filterQuery,
    moduleId: moduleId ?? undefined,
  };

  const useNoteQuery = api.note.query.get(query);
  const { data: notes = [], isLoading } = useNoteQuery;
  const createNote = api.note.mutate.create();
  const deleteNote = api.note.mutate.delete();

  const createModule = api.module.mutate.create();
  const updateModule = api.module.mutate.update();
  const deleteModule = api.module.mutate.delete();

  const gridRef = useGsapStagger<HTMLDivElement>([notes.length]);

  const [formCreateNote, setFormCreateNote] = useState<PickCreateNote>({
    content: '',
    title: '',
  });
  const [showModal, setShowModal] = useState<boolean>(false);

  const handleModalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...formCreateNote,
      moduleId: moduleId ?? undefined,
    };
    createNote.mutate(payload, {
      onSuccess: (res) => {
        setShowModal(false);
        setFormCreateNote({ content: '', title: '' });
        router.push(`${basePath}/${res.data.id}`);
      },
    });
  };

  const handleSelect = (id: string) => {
    router.push(`${basePath}/${id}`);
  };

  const handleDelete = (id: string) => {
    deleteNote.mutate(id);
  };

  const handleSearch = (search: string) => {
    setFilterQuery((prev) => ({ ...prev, search, page: 1 }));
  };

  const handlePageChange = (page: number) => {
    setFilterQuery((prev) => ({ ...prev, page }));
  };

  const handleSelectModule = (module: IModule) => {
    router.push(`${basePath}/m/${module.id}`);
  };

  const handleBackToModules = () => {
    router.push(basePath);
  };

  const handleSwitchModule = (module: IModule) => {
    router.push(`${basePath}/m/${module.id}`);
  };

  const handleCreateModule = async (payload: PickCreateModule) => {
    await createModule.mutateAsync(payload);
  };

  const handleUpdateModule = async (id: string, payload: PickUpdateModule) => {
    await updateModule.mutateAsync({ id, payload });
  };

  const handleDeleteModule = async (id: string) => {
    await deleteModule.mutateAsync(id);
    if (moduleId === id) {
      router.push(basePath);
    }
  };

  return (
    <NotesPageSection
      service={{
        handleDelete,
        handleSelect,
        handleSubmit: handleModalSubmit,
        isPending: createNote.isPending,
        onSearch: handleSearch,
        onPageChange: handlePageChange,
        moduleContext: {
          modules,
          activeModule,
          moduleId,
          isLoadingModules,
          canManageModules,
          onSelectModule: handleSelectModule,
          onBackToModules: handleBackToModules,
          onSwitchModule: handleSwitchModule,
          handleCreateModule,
          handleUpdateModule,
          handleDeleteModule,
        },
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
  );
}
