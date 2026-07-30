import { Trash2 } from "lucide-react";
import { useMemo } from "react";

import { Button } from "@/components/atoms";
import { GhibliCard } from "@/components/molecules/GhibliCard";
import { GhibliTabs } from "@/components/molecules/GhibliTabs";
import { TodoCheckbox } from "@/components/molecules/TodoCheckbox";
import { GhibliEmptyState } from "@/components/template/GhibliEmptyState";
import type { Todo } from "@repo/types";
import type { PickApiID } from "@repo/types/api.types";
import { formatDateTime } from "@repo";

export type TabValue = "all" | "pending" | "completed";

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
      <div className="w-full flex flex-col items-start">
        <span
          className={
            todo.status === "completed"
              ? "flex-1 text-sm text-muted-foreground line-through"
              : "flex-1 text-sm"
          }
        >
          {todo.text}
        </span>
        <span className="">{formatDateTime(todo.dueDate!)}</span>
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="size-8 text-destructive"
        onClick={handleDeleteClick}
        disabled={disabled}
      >
        <Trash2 className="size-4" />
      </Button>
    </li>
  );
}

interface TodoListSectionProps {
  service: {
    handleToggleTodo: (id: PickApiID, checked: boolean) => void;
    handleDeleteTodo: (id: PickApiID) => void;
  };
  state: {
    todos: Todo[];
    isLoading: boolean;
    isPending: boolean;
    tab: TabValue;
    setTab: (val: TabValue) => void;
  };
}

export function TodoListSection({ service, state }: TodoListSectionProps) {
  const { handleToggleTodo, handleDeleteTodo } = service;
  const { todos, isLoading, isPending, tab, setTab } = state;

  const tabs = useMemo(
    () => [
      { value: "all" as const, label: "Semua" },
      { value: "pending" as const, label: "Belum Selesai" },
      { value: "completed" as const, label: "Selesai" },
    ],
    [],
  );

  return (
    <GhibliCard hover={false}>
      <GhibliTabs tabs={tabs} value={tab} onChange={setTab} />

      {isLoading ? (
        <div className="mt-4 space-y-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-12 rounded-xl bg-muted" />
          ))}
        </div>
      ) : todos.length === 0 ? (
        <GhibliEmptyState
          title={
            tab === "completed"
              ? "Belum ada tugas selesai"
              : "Daftar tugas masih kosong"
          }
          description="Susuwatari sedang tidur — tambahkan tugas pertamamu!"
        />
      ) : (
        <ul className="mt-4 space-y-2">
          {todos.map((todo) => (
            <TodoListItem
              key={todo.id}
              todo={todo}
              disabled={isPending}
              onToggle={handleToggleTodo}
              onDelete={handleDeleteTodo}
            />
          ))}
        </ul>
      )}
    </GhibliCard>
  );
}
