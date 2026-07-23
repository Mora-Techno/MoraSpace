"use client";

import { Trash2 } from "lucide-react";
import { useMemo, useState } from "react";

import { Button } from "@/components/atoms";
import { GhibliCard } from "@/components/molecules/ghibli-card";
import { GhibliTabs } from "@/components/molecules/ghibli-tabs";
import { TodoCheckbox } from "@/components/molecules/todo-checkbox";
import { GhibliEmptyState } from "@/components/template/ghibli-empty-state";
import { useApi } from "@/hooks/useApi/useApi";
import { useGsapStagger } from "@/hooks/useGsapStagger";
import type { Todo, TodoQuery } from "@repo/types";
import type { PickApiID } from "@repo/types/api.types";

type TabValue = "all" | "pending" | "completed";

type TodoListItemProps = {
  todo: Todo;
  disabled: boolean;
  onToggle: (id: PickApiID, checked: boolean) => void;
  onDelete: (id: PickApiID) => void;
};

function TodoListItem({
  todo,
  disabled,
  onToggle,
  onDelete,
}: TodoListItemProps) {
  const todoId = { id: todo.id };

  const handleToggleChange = (checked: boolean) => {
    onToggle(todoId, checked);
  };

  const handleDeleteClick = () => {
    onDelete(todoId);
  };

  return (
    <li
      data-stagger-item
      className="flex items-center gap-3 rounded-xl bg-background/50 px-3 py-3"
    >
      <TodoCheckbox
        checked={todo.status === "completed"}
        disabled={disabled}
        onChange={handleToggleChange}
      />
      <span
        className={
          todo.status === "completed"
            ? "flex-1 text-sm text-muted-foreground line-through"
            : "flex-1 text-sm"
        }
      >
        {todo.text}
      </span>
      <Button
        variant="ghost"
        size="icon"
        className="size-8 text-destructive"
        onClick={handleDeleteClick}
      >
        <Trash2 className="size-4" />
      </Button>
    </li>
  );
}

export function TodoListSection() {
  const api = useApi();
  const [tab, setTab] = useState<TabValue>("all");
  const query: TodoQuery | undefined =
    tab === "all" ? undefined : { status: tab as "pending" | "completed" };
  const useTodos = api.todo.query.get(query);
  const useUpdateTodo = api.todo.mutate.update();
  const useDeleteTodo = api.todo.mutate.delete();
  const { data: todos = [], isLoading } = useTodos;
  const updateTodo = useUpdateTodo;
  const deleteTodo = useDeleteTodo;
  const listRef = useGsapStagger<HTMLUListElement>([todos.length, tab]);

  const handleToggleTodo = (id: PickApiID, checked: boolean) => {
    updateTodo.mutate({
      id,
      payload: { status: checked ? "completed" : "pending" },
    });
  };

  const handleDeleteTodo = (id: PickApiID) => {
    deleteTodo.mutate(id);
  };

  // handlingnya terlalu jelek ish

  const tabs = useMemo(
    () => [
      { value: "all" as const, label: "Semua" },
      { value: "pending" as const, label: "Belum Selesai" },
      { value: "completed" as const, label: "Selesai" },
    ],
    [],
  );

  return (
    <GhibliCard>
      <GhibliTabs tabs={tabs} value={tab} onChange={setTab} />

      {isLoading ? (
        <div className="mt-4 space-y-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-12 animate-pulse rounded-xl bg-muted" />
          ))}
        </div>
      ) : todos.length === 0 ? (
        <GhibliEmptyState
          emoji="✨"
          title={
            tab === "completed"
              ? "Belum ada tugas selesai"
              : "Daftar tugas masih kosong"
          }
          description="Susuwatari sedang tidur — tambahkan tugas pertamamu!"
        />
      ) : (
        <ul ref={listRef} className="mt-4 space-y-2">
          {todos.map((todo) => (
            <TodoListItem
              key={todo.id}
              todo={todo}
              disabled={updateTodo.isPending || deleteTodo.isPending}
              onToggle={handleToggleTodo}
              onDelete={handleDeleteTodo}
            />
          ))}
        </ul>
      )}
    </GhibliCard>
  );
}
