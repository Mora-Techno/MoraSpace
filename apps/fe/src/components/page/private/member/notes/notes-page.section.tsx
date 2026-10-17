'use client';

import type { NoteQuery, PickCreateNote } from '@repo/types';
import type { IModule, PickCreateModule, PickUpdateModule } from '@repo/types/module.types';
import { Plus } from 'lucide-react';
import type { Dispatch, SetStateAction } from 'react';
import { useState } from 'react';

import { Button } from '@/components/atoms';
import { CreateModuleDialog, ModuleHeader } from '@/components/molecules';
import { PageHeader } from '@/components/molecules/PageHeader';
import { ModuleGridSection } from '@/components/organisms';
import { NoteListSection } from '@/components/page/private/member/notes/note-list.section';

interface NotesPageSectionProps {
  service: {
    handleDelete: (id: string) => void;
    handleSelect: (id: string) => void;
    handleSubmit: (e: React.FormEvent) => void;
    isPending: boolean;
    onSearch: (search: string) => void;
    onPageChange: (page: number) => void;
    moduleContext?: {
      modules: IModule[];
      activeModule: IModule | null;
      moduleId: string | null;
      isLoadingModules: boolean;
      canManageModules: boolean;
      onSelectModule: (module: IModule) => void;
      onBackToModules: () => void;
      onSwitchModule: (module: IModule) => void;
      handleCreateModule: (payload: PickCreateModule) => Promise<void>;
      handleUpdateModule: (id: string, payload: PickUpdateModule) => Promise<void>;
      handleDeleteModule: (id: string) => Promise<void>;
    };
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
  const {
    handleDelete,
    handleSelect,
    handleSubmit,
    isPending,
    onSearch,
    onPageChange,
    moduleContext,
  } = service;
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

  const [openCreateModuleModal, setOpenCreateModuleModal] = useState(false);
  const [editingModule, setEditingModule] = useState<IModule | null>(null);

  if (moduleContext && !moduleContext.moduleId) {
    return (
      <div className="w-full">
        <ModuleGridSection
          type="NOTE"
          modules={moduleContext.modules}
          isLoading={moduleContext.isLoadingModules}
          canManage={moduleContext.canManageModules}
          onSelect={moduleContext.onSelectModule}
          onCreate={() => {
            setEditingModule(null);
            setOpenCreateModuleModal(true);
          }}
          onEdit={(m) => {
            setEditingModule(m);
            setOpenCreateModuleModal(true);
          }}
          onDelete={(m) => moduleContext.handleDeleteModule(m.id)}
        />
        <CreateModuleDialog
          open={openCreateModuleModal}
          onOpenChange={setOpenCreateModuleModal}
          type="NOTE"
          moduleToEdit={editingModule}
          onSubmit={async (data) => {
            if (editingModule) {
              await moduleContext.handleUpdateModule(editingModule.id, data);
            } else {
              await moduleContext.handleCreateModule(data as any);
            }
          }}
        />
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-700">
      {moduleContext?.activeModule ? (
        <ModuleHeader
          activeModule={moduleContext.activeModule}
          modules={moduleContext.modules}
          onBack={moduleContext.onBackToModules}
          onSwitchModule={moduleContext.onSwitchModule}
          onEdit={(m) => {
            setEditingModule(m);
            setOpenCreateModuleModal(true);
          }}
          onDelete={(m) => moduleContext.handleDeleteModule(m.id)}
          canManage={moduleContext.canManageModules}
          extraAction={
            <Button onClick={() => setShowModal(true)} size="sm" className="gap-1.5 h-9 text-xs">
              <Plus className="size-3.5" />
              <span>Catatan Baru</span>
            </Button>
          }
        />
      ) : (
        <PageHeader title="Notes" description="Simpan ide, jurnal harian, dan snippet kode." />
      )}

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

      {moduleContext && (
        <CreateModuleDialog
          open={openCreateModuleModal}
          onOpenChange={setOpenCreateModuleModal}
          type="NOTE"
          moduleToEdit={editingModule}
          onSubmit={async (data) => {
            if (editingModule) {
              await moduleContext.handleUpdateModule(editingModule.id, data);
            } else {
              await moduleContext.handleCreateModule(data as any);
            }
          }}
        />
      )}
    </div>
  );
}

export default NotesPageSection;
