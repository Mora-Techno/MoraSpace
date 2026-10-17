'use client';

import type { TodoQuery } from '@repo/types';
import type { PickApiID } from '@repo/types/api.types';
import type { IModule, PickCreateModule, PickUpdateModule } from '@repo/types/module.types';
import { Plus } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/atoms';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/atoms/Sheet';
import { CreateModuleDialog, ModuleHeader } from '@/components/molecules';
import { PageHeader } from '@/components/molecules/PageHeader';
import { ModuleGridSection } from '@/components/organisms';
import { TodoFormSection } from '@/components/page/private/member/todos/todo-form.section';
import {
  type TabValue,
  TodoListSection,
} from '@/components/page/private/member/todos/todo-list.section';
import type { AlertContexType } from '@/types/ui';

interface TodosPageSectionProps {
  service: {
    todos: Parameters<typeof TodoListSection>[0]['state']['todos'];
    isLoading: boolean;
    isListPending: boolean;
    query: TodoQuery;
    createPending: boolean;
    handleToggleTodo: (id: string, checked: boolean) => void;
    handleDeleteTodo: (id: string) => void;
    handleSearch: (search: string) => void;
    handlePageChange: (page: number) => void;
    handleSelectTodo: (id: string) => void;
    handleSubmit: (e: React.FormEvent) => void;
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
    alert: AlertContexType;
    tab: TabValue;
    setTab: (v: TabValue) => void;
    open: boolean;
    setOpen: (v: boolean) => void;
    text: string;
    setText: (v: string) => void;
    dueDate: string;
    setDueDate: (v: string) => void;
    listQuery: TodoQuery;
  };
}

export function TodosPageSection({ service, state }: TodosPageSectionProps) {
  const {
    todos,
    isLoading,
    isListPending,
    query,
    createPending,
    handleToggleTodo,
    handleDeleteTodo,
    handleSearch,
    handlePageChange,
    handleSelectTodo,
    handleSubmit,
    moduleContext,
  } = service;
  const { alert, tab, setTab, open, setOpen, text, setText, dueDate, setDueDate, listQuery } =
    state;

  const [openCreateModuleModal, setOpenCreateModuleModal] = useState(false);
  const [editingModule, setEditingModule] = useState<IModule | null>(null);

  if (moduleContext && !moduleContext.moduleId) {
    return (
      <div className="w-full">
        <ModuleGridSection
          type="TODO"
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
          type="TODO"
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
    <div className="">
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
            <div className="flex items-center gap-2">
              <Sheet open={open} onOpenChange={setOpen}>
                <SheetTrigger asChild>
                  <Button size="sm" className="gap-1.5 h-9 text-xs">
                    <Plus className="size-3.5" />
                    <span>Tugas Baru</span>
                  </Button>
                </SheetTrigger>
                <SheetContent
                  side="bottom"
                  className="rounded-t-3xl sm:side-right sm:max-w-md sm:rounded-none"
                >
                  <SheetHeader>
                    <SheetTitle className="font-serif">Tugas Baru</SheetTitle>
                  </SheetHeader>
                  <div className="px-4 pb-6 pt-4">
                    <TodoFormSection
                      service={{ handleSubmit }}
                      state={{
                        text,
                        setText,
                        dueDate,
                        setDueDate,
                        isPending: createPending,
                      }}
                    />
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          }
        />
      ) : (
        <PageHeader
          title="Todos"
          description="Kelola tugas harianmu dengan tenang, satu per satu."
          action={
            <div className="lg:hidden">
              <Sheet open={open} onOpenChange={setOpen}>
                <SheetTrigger asChild>
                  <Button size="icon" className="ghibli-btn rounded-full">
                    <Plus className="size-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="bottom" className="rounded-t-3xl">
                  <SheetHeader>
                    <SheetTitle className="font-serif">Tugas Baru</SheetTitle>
                  </SheetHeader>
                  <div className="px-4 pb-6">
                    <TodoFormSection
                      service={{ handleSubmit }}
                      state={{
                        text,
                        setText,
                        dueDate,
                        setDueDate,
                        isPending: createPending,
                      }}
                    />
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          }
        />
      )}

      <div className="w-full">
        <TodoListSection
          service={{
            handleToggleTodo,
            handleDeleteTodo,
            onSearch: handleSearch,
            onPageChange: handlePageChange,
            handleSelectTodo,
          }}
          state={{
            alert,
            todos,
            isLoading,
            isPending: isListPending,
            tab,
            setTab,
            query: listQuery,
          }}
        />
      </div>

      {moduleContext && (
        <CreateModuleDialog
          open={openCreateModuleModal}
          onOpenChange={setOpenCreateModuleModal}
          type="TODO"
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

export default TodosPageSection;
