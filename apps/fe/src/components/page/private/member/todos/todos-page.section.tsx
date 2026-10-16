'use client';

import type { TodoQuery } from '@repo/types';
import type { PickApiID } from '@repo/types/api.types';
import { Plus } from 'lucide-react';

import { Button } from '@/components/atoms';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/atoms/Sheet';
import { PageHeader } from '@/components/molecules/PageHeader';
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
  } = service;
  const { alert, tab, setTab, open, setOpen, text, setText, dueDate, setDueDate, listQuery } =
    state;

  return (
    <div className="">
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
    </div>
  );
}

export default TodosPageSection;
