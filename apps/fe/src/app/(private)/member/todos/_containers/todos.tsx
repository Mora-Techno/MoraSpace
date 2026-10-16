'use client';

import type { TodoQuery } from '@repo/types';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { type TabValue } from '@/components/page/private/member/todos/todo-list.section';
import { TodosPageSection } from '@/components/page/private/member/todos/todos-page.section';
import { useApi } from '@/hooks/useApi/useApi';
import { useAppNameSpace } from '@/hooks/useAppNameSpace';

export default function TodosContainer() {
  const [open, setOpen] = useState(false);
  const api = useApi();
  const router = useRouter();
  const ns = useAppNameSpace();

  // Todo List State
  const [tab, setTab] = useState<TabValue>('all');
  const [listQuery, setListQuery] = useState<TodoQuery>({
    page: 1,
    limit: 10,
    search: '',
  });

  const query: TodoQuery = {
    ...listQuery,
    status: tab === 'all' ? undefined : (tab as 'pending' | 'completed'),
  };

  const useTodos = api.todo.query.get(query);
  const updateTodo = api.todo.mutate.update();
  const deleteTodo = api.todo.mutate.delete();

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

  const handleSelectTodo = (id: string) => {
    router.push(`/member/todos/${id}`);
  };

  const isListPending = updateTodo.isPending || deleteTodo.isPending;

  // Todo Form State
  const [text, setText] = useState('');
  const [dueDate, setDueDate] = useState('');

  const createTodo = api.todo.mutate.create(query);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    createTodo.mutate(
      {
        text: text.trim(),
        ...(dueDate && { dueDate: new Date(dueDate).toISOString() }),
      },
      {
        onSuccess: () => {
          setText('');
          setDueDate('');
          setOpen(false);
        },
      },
    );
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
      }}
      state={{
        alert: ns.alert,
        tab,
        setTab,
        open,
        setOpen,
        text,
        setText,
        dueDate,
        setDueDate,
        listQuery,
      }}
    />
  );
}
