import * as React from "react";
import { GlassCard } from "@/components/molecules/GlassCard";
import { WidgetHeader } from "@/components/atoms/WidgetHeader";
import { CheckSquare, Plus } from "lucide-react";
import { TodoItemCard } from "@/components/molecules/TodoItemCard";
import { Skeleton } from "@/components/atoms/Skeleton";
import { Button, Input } from "@/components/atoms";
import { Todo } from "@repo/types";

interface TodoListSectionProps {
  service: {
    handleToggle: (id: string, checked: boolean) => void;
    handleAdd: (e: React.FormEvent) => void;
    updateTodo: any;
    createTodo: any;
  };
  state: {
    Todos: Todo[];
    uncompletedTodosCount: number;
    isLoading: boolean;
    newTaskText: string;
    setNewTaskText: React.Dispatch<React.SetStateAction<string>>;
  };
}

export function TodoListSection({ service, state }: TodoListSectionProps) {
  const { handleToggle, handleAdd, updateTodo, createTodo } = service;
  const {
    Todos,
    uncompletedTodosCount,
    isLoading,
    newTaskText,
    setNewTaskText,
  } = state;

  return (
    <GlassCard className="p-6 flex flex-col h-[420px]" data-stagger-item>
      <WidgetHeader
        title="Prioritas Hari Ini"
        icon={<CheckSquare className="size-5" />}
        action={
          <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full font-medium">
            {uncompletedTodosCount} Belum Selesai
          </span>
        }
      />

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
          Todos.map((todo: Todo) => (
            <TodoItemCard
              key={todo.id}
              todo={todo}
              isUpdating={
                updateTodo.variables?.id?.id === todo.id && updateTodo.isPending
              }
              onToggle={(checked: boolean) => handleToggle(todo.id, checked)}
            />
          ))
        )}
      </div>

      <form onSubmit={handleAdd} className="mt-auto flex gap-2">
        <Input
          placeholder="Tugas baru..."
          value={newTaskText}
          onChange={(e) => setNewTaskText(e.target.value)}
          className="flex-1 bg-background/50 h-10 border-transparent focus-visible:ring-1"
          disabled={createTodo.isPending}
        />
        <Button
          type="submit"
          size="sm"
          className="h-10 px-3 shrink-0"
          disabled={createTodo.isPending || !newTaskText.trim()}
        >
          <Plus className="size-4" />
        </Button>
      </form>
    </GlassCard>
  );
}
