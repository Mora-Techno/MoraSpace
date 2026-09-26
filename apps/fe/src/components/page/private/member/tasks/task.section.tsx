import React, { useState } from "react";
import { Plus, AlertCircle, Clock, CheckCircle2, Trash2, Layers } from "lucide-react";
import { PageHeader } from "@/components/molecules/PageHeader";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Input,
  Label,
  Textarea,
  Select,
} from "@/components/atoms";
import type { ITask } from "@repo/types";

export interface TaskSectionProps {
  service: {
    tasks: ITask[];
    isLoading: boolean;
    handleCreate: (payload: { title: string; description?: string; statusId: string }) => void;
    handleStatusChange: (id: string, statusId: string) => void;
    handleDelete: (id: string) => void;
    isPending: boolean;
  };
}

const STATUS_COLUMNS = [
  { id: "todo", title: "To Do", icon: AlertCircle, color: "text-amber-500" },
  { id: "in_progress", title: "In Progress", icon: Clock, color: "text-blue-500" },
  { id: "done", title: "Done", icon: CheckCircle2, color: "text-emerald-500" },
];

export const TaskSection: React.FC<TaskSectionProps> = ({
  service: { tasks, isLoading, handleCreate, handleStatusChange, handleDelete, isPending },
}) => {
  const [openModal, setOpenModal] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [statusId, setStatusId] = useState("todo");

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    handleCreate({
      title: title.trim(),
      description: description.trim() || undefined,
      statusId,
    });
    setTitle("");
    setDescription("");
    setStatusId("todo");
    setOpenModal(false);
  };

  return (
    <div className="w-full space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageHeader
          title="Task Management"
          description="Kanban board kolaborasi tim untuk memonitor progres kerja."
        />
        <Button onClick={() => setOpenModal(true)} className="gap-2 shrink-0">
          <Plus className="w-4 h-4" />
          Tambah Task
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {STATUS_COLUMNS.map((col) => {
          const colTasks = tasks.filter((t) => (t.statusId || "todo") === col.id);
          const ColIcon = col.icon;

          return (
            <Card key={col.id} className="min-h-[500px] flex flex-col">
              <CardHeader className="flex flex-row items-center justify-between pb-3">
                <div className="flex items-center gap-2">
                  <ColIcon className={`w-4 h-4 ${col.color}`} />
                  <CardTitle className="text-sm font-semibold">{col.title}</CardTitle>
                  <span className="px-2 py-0.5 text-xs rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400">
                    {colTasks.length}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col pt-0">
                {isLoading ? (
                  <div className="flex items-center justify-center flex-1 text-sm text-neutral-400">
                    Memuat task...
                  </div>
                ) : colTasks.length === 0 ? (
                  <div className="flex flex-col items-center justify-center flex-1 border border-dashed border-neutral-200 dark:border-neutral-800 rounded-lg p-6 text-neutral-400 text-center">
                    <Layers className="w-8 h-8 mb-2 opacity-40" />
                    <span className="text-xs">Belum ada task</span>
                  </div>
                ) : (
                  <div className="space-y-3 overflow-y-auto">
                    {colTasks.map((task) => (
                      <Card key={task.id} className="p-3 shadow-none border-neutral-200 dark:border-neutral-800">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                            {task.title}
                          </h4>
                          <button
                            onClick={() => handleDelete(task.id)}
                            className="text-neutral-400 hover:text-red-500 transition p-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        {task.description && (
                          <p className="text-xs text-neutral-500 mt-1 line-clamp-2">
                            {task.description}
                          </p>
                        )}
                        <div className="mt-3 pt-2 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-xs">
                          <select
                            value={task.statusId || "todo"}
                            onChange={(e) => handleStatusChange(task.id, e.target.value)}
                            className="bg-transparent text-neutral-600 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700 rounded px-2 py-0.5 text-xs outline-none"
                          >
                            <option value="todo">To Do</option>
                            <option value="in_progress">In Progress</option>
                            <option value="done">Done</option>
                          </select>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Dialog open={openModal} onOpenChange={setOpenModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tambah Task Baru</DialogTitle>
          </DialogHeader>
          <form onSubmit={onSubmit} className="space-y-4 mt-2">
            <div className="space-y-2">
              <Label htmlFor="title">Judul</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Judul task..."
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Deskripsi</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Rincian task..."
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <select
                id="status"
                value={statusId}
                onChange={(e) => setStatusId(e.target.value)}
                className="w-full text-sm px-3 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg bg-transparent"
              >
                <option value="todo">To Do</option>
                <option value="in_progress">In Progress</option>
                <option value="done">Done</option>
              </select>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => setOpenModal(false)}>
                Batal
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Menyimpan..." : "Simpan Task"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};
