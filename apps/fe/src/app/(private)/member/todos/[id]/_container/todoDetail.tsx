"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Button } from "@/components/atoms";
import { PageHeader } from "@/components/molecules/PageHeader";
import { TodoDetailSection } from "@/components/page/private/member/todos/todo-detail.section";
import { useApi } from "@/hooks/useApi/useApi";
import type { PickUpdateTodo } from "@repo/types";

function toLocalInput(iso: string | null): string {
  if (!iso) return "";
  const date = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
    date.getDate(),
  )}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export default function TodoDetailContainer({ id }: { id: string }) {
  const api = useApi();
  const router = useRouter();
  const pathname = usePathname();
  const listRoute = pathname.includes("/owner/")
    ? "/owner/member/todos"
    : "/member/todos";
  const { data: todo, isLoading } = api.todo.query.getByID(id);
  const updateTodo = api.todo.mutate.update();
  const deleteTodo = api.todo.mutate.delete();

  const [form, setForm] = useState<PickUpdateTodo>({
    text: "",
    dueDate: null,
  });

  useEffect(() => {
    if (todo) {
      setForm({
        text: todo.text,
        dueDate: todo.dueDate ? toLocalInput(todo.dueDate) : null,
      });
    }
  }, [todo]);

  const handleToggle = () => {
    if (!todo) return;
    updateTodo.mutate({
      id: todo.id,
      payload: {
        status: todo.status === "completed" ? "pending" : "completed",
      },
    });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!todo) return;
    updateTodo.mutate({
      id: todo.id,
      payload: {
        text: form.text?.trim() || todo.text,
        ...(form.dueDate
          ? { dueDate: new Date(form.dueDate).toISOString() }
          : { dueDate: null }),
      },
    });
  };

  const handleDelete = () => {
    if (!todo) return;
    deleteTodo.mutate(todo.id, {
      onSuccess: () => router.push(listRoute),
    });
  };

  return (
    <div className="animate-in fade-in duration-700">
      <PageHeader
        title="Detail Tugas"
        action={
          <Button variant="outline" size="sm" asChild className="ghibli-btn">
            <Link href={listRoute}>
              <ArrowLeft className="size-4" /> Kembali
            </Link>
          </Button>
        }
      />
      <TodoDetailSection
        service={{ handleToggle, handleSave, handleDelete }}
        state={{
          todo,
          isLoading,
          isPending: updateTodo.isPending || deleteTodo.isPending,
          form,
          setForm,
        }}
      />
    </div>
  );
}
