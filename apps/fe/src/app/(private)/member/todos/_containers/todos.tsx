"use client";

import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/atoms";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/atoms/Sheet";
import { PageHeader } from "@/components/molecules/PageHeader";
import { TodoFormSection } from "@/components/page/private/member/todos/todo-form.section";
import {
  TodoListSection,
  type TabValue,
} from "@/components/page/private/member/todos/todo-list.section";
import { useApi } from "@/hooks/useApi/useApi";
import type { TodoQuery } from "@repo/types";
import type { PickApiID } from "@repo/types/api.types";
import { useAppNameSpace } from "@/hooks/useAppNameSpace";

export default function TodosContainer() {
  const [open, setOpen] = useState(false);
  const api = useApi();
  const router = useRouter();
  const ns = useAppNameSpace();

  // Todo List State
  const [tab, setTab] = useState<TabValue>("all");
  const [listQuery, setListQuery] = useState<TodoQuery>({
    page: 1,
    limit: 10,
    search: "",
  });

  const query: TodoQuery = {
    ...listQuery,
    status: tab === "all" ? undefined : (tab as "pending" | "completed"),
  };

  const useTodos = api.todo.query.get(query);
  const updateTodo = api.todo.mutate.update();
  const deleteTodo = api.todo.mutate.delete();

  const { data: todos = [], isLoading } = useTodos;

  const handleToggleTodo = (id: string, checked: boolean) => {
    updateTodo.mutate({
      id,
      payload: { status: checked ? "completed" : "pending" },
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
  const [text, setText] = useState("");
  const [dueDate, setDueDate] = useState("");

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
          setText("");
          setDueDate("");
          setOpen(false);
        },
      },
    );
  };

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
                      isPending: createTodo.isPending,
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
            alert: ns.alert,
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
