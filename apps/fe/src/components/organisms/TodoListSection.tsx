import { PickUpdateTodo, Todo } from "@repo/types";
import { CheckSquare, Plus } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/atoms";
import { Skeleton } from "@/components/atoms/Skeleton";
import { WidgetHeader } from "@/components/atoms/WidgetHeader";
import { GlassCard } from "@/components/molecules/GlassCard";
import { TodoItemCard } from "@/components/molecules/TodoItemCard";
import { useCreateTodo, useUpdateTodo } from "@/hooks/useApi/todo";

import TodoCreateModal from "../molecules/modal/TodoCreateModal";

interface TodoListSectionProps {
  service: {
    handleToggle: (id: string, checked: boolean) => void;
    handleAdd: (e: React.FormEvent) => void;
    updateTodo: ReturnType<typeof useUpdateTodo>;
    createTodo: ReturnType<typeof useCreateTodo>;
  };
  state: {
    Todos: Todo[];
    uncompletedTodosCount: number;
    showModalTodo: boolean;
    setShowModalTodo: React.Dispatch<React.SetStateAction<boolean>>;
    isLoading: boolean;
    formUpdateTodo: PickUpdateTodo;
    setFormUpdateTodo: React.Dispatch<React.SetStateAction<PickUpdateTodo>>;
  };
}

export function TodoListSection({ service, state }: TodoListSectionProps) {
  const { handleToggle, handleAdd, updateTodo, createTodo } = service;
  const {
    Todos,
    uncompletedTodosCount,
    isLoading,
    formUpdateTodo,
    setShowModalTodo,
    showModalTodo,
    setFormUpdateTodo,
  } = state;

  return (
    <GlassCard className="p-6 flex flex-col h-full" data-stagger-item>
      <div className="w-full flex justify-between items-start flex-col">
        <WidgetHeader
          className="w-full"
          title="Prioritas Hari Ini"
          icon={<CheckSquare className="size-5" />}
          action={
            <Button
              size="sm"
              className="h-8 px-3 shrink-0"
              type="button"
              onClick={() => {
                setShowModalTodo(true);
              }}
            >
              <Plus className="size-4" />
            </Button>
          }
        />
        <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full font-medium">
          {uncompletedTodosCount} Belum Selesai
        </span>
      </div>

      <div className="flex-1 overflow-y-auto mb-4 space-y-2 pr-2">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full rounded-xl" />
          ))
        ) : Todos.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center text-center text-muted-foreground opacity-70">
            <span className="text-4xl mb-2">✨</span>
            <p className="text-sm">Semua tugas prioritas selesai!</p>
          </div>
        ) : (
          <div className="w-full my-2">
            {Todos.map((todo: Todo) => (
              <TodoItemCard
                key={todo.id}
                todo={todo}
                isUpdating={
                  updateTodo.variables?.id?.id === todo.id &&
                  updateTodo.isPending
                }
                onToggle={(checked: boolean) => handleToggle(todo.id, checked)}
              />
            ))}
          </div>
        )}
      </div>

      <TodoCreateModal
        open={showModalTodo}
        onOpenChange={setShowModalTodo}
        handleAdd={handleAdd}
        formCreateTodo={formUpdateTodo}
        setFormCreateTodo={setFormUpdateTodo}
        isPending={createTodo.isPending}
      />
    </GlassCard>
  );
}
