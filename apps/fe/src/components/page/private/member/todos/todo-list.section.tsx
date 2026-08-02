import { ChevronLeft, ChevronRight, Search, Trash2 } from "lucide-react";

import { Button } from "@/components/atoms";
import { Input } from "@/components/atoms/Input";
import { GhibliCard } from "@/components/molecules/GhibliCard";
import { GhibliTabs } from "@/components/molecules/GhibliTabs";
import { TodoCheckbox } from "@/components/molecules/TodoCheckbox";
import { GhibliEmptyState } from "@/components/template/GhibliEmptyState";
import type { Todo, TodoQuery } from "@repo/types";
import type { PickApiID } from "@repo/types/api.types";
import { formatDateTime } from "@repo";

export type TabValue = "all" | "pending" | "completed";

const TABS: { value: TabValue; label: string }[] = [
  { value: "all", label: "Semua" },
  { value: "pending", label: "Belum Selesai" },
  { value: "completed", label: "Selesai" },
];

type TodoListItemProps = {
  todo: Todo;
  disabled: boolean;
  onToggle: (id: PickApiID, checked: boolean) => void;
  onDelete: (id: PickApiID) => void;
  onClick: (id: string) => void;
};

function TodoListItem({
  todo,
  disabled,
  onToggle,
  onDelete,
  onClick,
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
      className="flex cursor-pointer items-center gap-3 rounded-xl bg-background/50 px-3 py-3 transition-colors hover:bg-background/80"
      onClick={() => onClick(todo.id)}
    >
      <div onClick={(e) => e.stopPropagation()}>
        <TodoCheckbox
          checked={todo.status === "completed"}
          disabled={disabled}
          onChange={handleToggleChange}
        />
      </div>
      <div className="flex w-full flex-col items-start">
        <span
          className={
            todo.status === "completed"
              ? "flex-1 text-sm text-muted-foreground line-through"
              : "flex-1 text-sm"
          }
        >
          {todo.text}
        </span>
        <span className="text-xs text-muted-foreground">
          {todo.dueDate ? formatDateTime(todo.dueDate) : "Tanpa tenggat"}
        </span>
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="size-8 shrink-0 text-destructive"
        onClick={(e) => {
          e.stopPropagation();
          handleDeleteClick();
        }}
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
    onSearch: (search: string) => void;
    onPageChange: (page: number) => void;
    handleSelectTodo: (id: string) => void;
  };
  state: {
    todos: Todo[];
    isLoading: boolean;
    isPending: boolean;
    tab: TabValue;
    setTab: (val: TabValue) => void;
    query: TodoQuery;
  };
}

export function TodoListSection({ service, state }: TodoListSectionProps) {
  const {
    handleToggleTodo,
    handleDeleteTodo,
    onSearch,
    onPageChange,
    handleSelectTodo,
  } = service;
  const { todos, isLoading, isPending, tab, setTab, query } = state;

  return (
    <GhibliCard hover={false}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <GhibliTabs tabs={TABS} value={tab} onChange={setTab} />
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Cari tugas..."
            value={query.search || ""}
            onChange={(e) => onSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

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
              onClick={handleSelectTodo}
            />
          ))}
        </ul>
      )}

      <div className="mt-6 flex justify-center gap-2 border-t border-border/50 pt-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange((query.page || 1) - 1)}
          disabled={(query.page || 1) <= 1}
        >
          <ChevronLeft />
        </Button>
        <div className="flex items-center px-4 text-sm font-medium">
          {query.page || 1}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange((query.page || 1) + 1)}
          disabled={todos.length < (query.limit || 10)}
        >
          <ChevronRight />
        </Button>
      </div>
    </GhibliCard>
  );
}
