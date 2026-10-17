'use client';

import type { TodoQuery } from '@repo/types';
import type { IModule, PickCreateModule, PickUpdateModule } from '@repo/types/module.types';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useMemo, useState } from 'react';

import { type TabValue } from '@/components/page/private/member/todos/todo-list.section';
import { TodosPageSection } from '@/components/page/private/member/todos/todos-page.section';
import { useApi } from '@/hooks/useApi/useApi';
import { useAppNameSpace } from '@/hooks/useAppNameSpace';
import { useWorkspaceSwitcher } from '@/hooks/useWorkspace';

interface TodosContainerProps {
  moduleId?: string;
}

export default function TodosContainer({ moduleId: propModuleId }: TodosContainerProps = {}) {
  const [open, setOpen] = useState(false);
  const api = useApi();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const moduleId = propModuleId ?? searchParams.get('moduleId');
  const basePath = pathname.includes('/owner/') ? '/owner/member/todos' : '/member/todos';
  const ns = useAppNameSpace();

  const { isPersonalActive, currentWorkspaceRole } = useWorkspaceSwitcher();
  const canManageModules =
    isPersonalActive || currentWorkspaceRole === 'Owner' || currentWorkspaceRole === 'Admin';

  const { data: modules = [], isLoading: isLoadingModules } = api.module.query.get({
    type: 'TODO',
  });
  const activeModule = useMemo(
    () => modules.find((m: IModule) => m.id === moduleId) ?? null,
    [modules, moduleId],
  );

  // Todo List State
  const [tab, setTab] = useState<TabValue>('all');
  const [listQuery, setListQuery] = useState<TodoQuery>({
    page: 1,
    limit: 10,
    search: '',
  });

  const query: TodoQuery = {
    ...listQuery,
    moduleId: moduleId ?? undefined,
    status: tab === 'all' ? undefined : (tab as 'pending' | 'completed'),
  };

  const useTodos = api.todo.query.get(query);
  const updateTodo = api.todo.mutate.update();
  const deleteTodo = api.todo.mutate.delete();

  const createModule = api.module.mutate.create();
  const updateModule = api.module.mutate.update();
  const deleteModule = api.module.mutate.delete();

  const { data: todos = [], isLoading } = useTodos;

  const handleToggleTodo = (id: string, checked: boolean) => {
    updateTodo.mutate({
      id,
      payload: { status: checked ? 'completed' : 'pending' },
    });
  };

  const handleDeleteTodo = (id: string) => {
    deleteTodo.mutate(id);
  };

  const handleSearch = (search: string) => {
    setListQuery((prev) => ({ ...prev, search, page: 1 }));
  };

  const handlePageChange = (page: number) => {
    setListQuery((prev) => ({ ...prev, page }));
  };

  function toLocalInput(iso: string | null): string {
    if (!iso) return '';
    const date = new Date(iso);
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
      date.getDate(),
    )}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
  }

  // Todo Form State
  const [text, setText] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [editingTodo, setEditingTodo] = useState<any | null>(null);

  const handleSelectTodo = (id: string) => {
    const target = todos.find((t: any) => t.id === id);
    if (target) {
      setEditingTodo(target);
      setText(target.text);
      setDueDate(target.dueDate ? toLocalInput(target.dueDate) : '');
      setOpen(true);
    }
  };

  const handleSelectModule = (module: IModule) => {
    router.push(`${basePath}/${module.id}`);
  };

  const handleBackToModules = () => {
    router.push(basePath);
  };

  const handleSwitchModule = (module: IModule) => {
    router.push(`${basePath}/${module.id}`);
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

  const isListPending = updateTodo.isPending || deleteTodo.isPending;

  const createTodo = api.todo.mutate.create(query);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    if (editingTodo) {
      updateTodo.mutate(
        {
          id: editingTodo.id,
          payload: {
            text: text.trim(),
            ...(dueDate ? { dueDate: new Date(dueDate).toISOString() } : { dueDate: null }),
          },
        },
        {
          onSuccess: () => {
            setText('');
            setDueDate('');
            setEditingTodo(null);
            setOpen(false);
          },
        },
      );
      return;
    }

    createTodo.mutate(
      {
        text: text.trim(),
        moduleId: moduleId ?? undefined,
        ...(dueDate && { dueDate: new Date(dueDate).toISOString() }),
      },
      {
        onSuccess: () => {
          setText('');
          setDueDate('');
          setEditingTodo(null);
          setOpen(false);
        },
      },
    );
  };

  const handleOpenChange = (val: boolean) => {
    setOpen(val);
    if (!val) {
      setEditingTodo(null);
      setText('');
      setDueDate('');
    }
  };

  return (
    <TodosPageSection
      service={{
        todos,
        isLoading,
        isListPending,
        query,
        createPending: createTodo.isPending,
        handleToggleTodo,
        handleDeleteTodo,
        handleSearch,
        handlePageChange,
        handleSelectTodo,
        handleSubmit,
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
        alert: ns.alert,
        tab,
        setTab,
        open,
        setOpen: handleOpenChange,
        text,
        setText,
        dueDate,
        setDueDate,
        listQuery,
      }}
    />
  );
}
