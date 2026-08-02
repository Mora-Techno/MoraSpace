import { CalendarClock, Trash2 } from "lucide-react";

import { Button } from "@/components/atoms";
import { Skeleton } from "@/components/atoms/Skeleton";
import { GhibliCard } from "@/components/molecules/GhibliCard";
import { TodoCheckbox } from "@/components/molecules/TodoCheckbox";
import type { PickUpdateTodo, Todo } from "@repo/types";
import { formatDateTime } from "@repo";

interface TodoDetailSectionProps {
  service: {
    handleToggle: () => void;
    handleSave: (e: React.FormEvent) => void;
    handleDelete: () => void;
  };
  state: {
    todo: Todo | undefined;
    isLoading: boolean;
    isPending: boolean;
    form: PickUpdateTodo;
    setForm: React.Dispatch<React.SetStateAction<PickUpdateTodo>>;
  };
}

export function TodoDetailSection({ service, state }: TodoDetailSectionProps) {
  const { handleToggle, handleSave, handleDelete } = service;
  const { todo, isLoading, isPending, form, setForm } = state;

  if (isLoading) {
    return (
      <GhibliCard>
        <Skeleton className="h-8 w-1/2" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-24 w-full" />
      </GhibliCard>
    );
  }

  if (!todo) {
    return (
      <GhibliCard>
        <p className="text-muted-foreground">Tugas tidak ditemukan.</p>
      </GhibliCard>
    );
  }

  return (
    <div className="space-y-4">
      <GhibliCard hover={false}>
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-3">
              <div onClick={(e) => e.stopPropagation()}>
                <TodoCheckbox
                  checked={todo.status === "completed"}
                  disabled={isPending}
                  onChange={handleToggle}
                />
              </div>
              <h2
                className={
                  todo.status === "completed"
                    ? "font-serif text-xl font-semibold line-through text-muted-foreground"
                    : "font-serif text-xl font-semibold"
                }
              >
                {todo.text}
              </h2>
            </div>
            <div className="mt-4 space-y-1 text-sm text-muted-foreground">
              <p className="flex items-center gap-2">
                <CalendarClock className="size-4" />
                {todo.dueDate ? formatDateTime(todo.dueDate) : "Tanpa tenggat"}
              </p>
              <p>Dibuat: {formatDateTime(todo.createdAt)}</p>
              <p>Diperbarui: {formatDateTime(todo.updatedAt)}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="size-9 shrink-0 text-destructive hover:bg-destructive/10"
            onClick={handleDelete}
            disabled={isPending}
          >
            <Trash2 className="size-4" />
          </Button>
        </div>
      </GhibliCard>

      <GhibliCard hover={false}>
        <h3 className="font-serif text-lg font-semibold">Edit Tugas</h3>
        <form onSubmit={handleSave} className="mt-3 space-y-3">
          <input
            value={form.text ?? ""}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, text: e.target.value }))
            }
            placeholder="Teks tugas..."
            className="w-full rounded-xl border border-input bg-background/80 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring"
          />
          <input
            type="datetime-local"
            value={form.dueDate ?? ""}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                dueDate: e.target.value || null,
              }))
            }
            className="w-full rounded-xl border border-input bg-background/80 px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
          />
          <div className="flex justify-end">
            <Button type="submit" className="ghibli-btn" disabled={isPending}>
              {isPending ? "Menyimpan..." : "Simpan Perubahan"}
            </Button>
          </div>
        </form>
      </GhibliCard>
    </div>
  );
}
