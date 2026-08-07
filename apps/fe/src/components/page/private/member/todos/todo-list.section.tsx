import { ChevronLeft, ChevronRight, Search, Trash2 } from "lucide-react";
import { Button } from "@/components/atoms";
import { Input } from "@/components/atoms/Input";
import { GhibliCard } from "@/components/molecules/GhibliCard";
import { GhibliTabs } from "@/components/molecules/GhibliTabs";
import { GhibliEmptyState } from "@/components/template/GhibliEmptyState";
import type { Todo, TodoQuery } from "@repo/types";
import { TodoListItem } from "@/components/molecules";
import { AlertContexType } from "@/types/ui";
export type TabValue = "all" | "pending" | "completed";

const TABS: { value: TabValue; label: string }[] = [
  { value: "all", label: "Semua" },
  { value: "pending", label: "Belum Selesai" },
  { value: "completed", label: "Selesai" },
];

interface TodoListSectionProps {
  service: {
    handleToggleTodo: (id: string, checked: boolean) => void;
    handleDeleteTodo: (id: string) => void;
    onSearch: (search: string) => void;
    onPageChange: (page: number) => void;
    handleSelectTodo: (id: string) => void;
  };
  state: {
    todos: Todo[];
    alert: AlertContexType;
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
  const { todos, isLoading, isPending, tab, setTab, query, alert } = state;

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
              alert={alert}
              disabled={isPending}
              onToggle={handleToggleTodo}
              onDelete={handleDeleteTodo}
              onClick={handleSelectTodo}
            />
          ))}
        </ul>
      )}

      {!todos.slice(0, 5) ? (
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
      ) : null}
    </GhibliCard>
  );
}
