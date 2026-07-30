"use client";

import { Plus } from "lucide-react";
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

export default function TodosContainer() {
  const [open, setOpen] = useState(false);
  const api = useApi();

  // Todo List State
  const [tab, setTab] = useState<TabValue>("all");
  const query: TodoQuery | undefined =
    tab === "all" ? undefined : { status: tab as "pending" | "completed" };
  const useTodos = api.todo.query.get(query);
  const updateTodo = api.todo.mutate.update();
  const deleteTodo = api.todo.mutate.delete();

  const { data: todos = [], isLoading } = useTodos;

  const handleToggleTodo = (id: PickApiID, checked: boolean) => {
    updateTodo.mutate({
      id,
      payload: { status: checked ? "completed" : "pending" },
    });
  };

  const handleDeleteTodo = (id: PickApiID) => {
    deleteTodo.mutate(id);
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

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <TodoListSection
            service={{ handleToggleTodo, handleDeleteTodo }}
            state={{
              todos,
              isLoading,
              isPending: isListPending,
              tab,
              setTab,
            }}
          />
        </div>
        <div className="hidden lg:block">
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
      </div>
    </div>
  );
}
