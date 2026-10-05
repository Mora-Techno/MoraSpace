import React, { useState } from 'react';
import {
  Plus,
  Trash2,
  Layers,
  Settings2,
  Pencil,
  GripVertical,
  CheckCircle2,
  Clock,
  AlertCircle,
  Sparkles,
  Palette,
  Check,
  Eye,
} from 'lucide-react';
import { PageHeader } from '@/components/molecules/PageHeader';
import { RichTextEditor } from '@/components/molecules/editor/RichTextEditor';
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
  Badge,
} from '@/components/atoms';
import { deleteObject, uploadAvatar } from '@/utils/r2-utils';
import { stripHtml } from '@/utils/html';
import type {
  ITask,
  TaskStatusOption,
  PickCreateTask,
  PickUpdateTask,
  PickCreateTaskStatus,
  PickUpdateTaskStatusItem,
} from '@repo/types';

export interface TaskSectionProps {
  service: {
    tasks: ITask[];
    statuses: TaskStatusOption[];
    isLoading: boolean;
    handleCreate: (payload: PickCreateTask) => void;
    handleUpdate: (id: string, payload: PickUpdateTask) => void;
    handleStatusChange: (id: string, statusId: string) => void;
    handleDelete: (id: string) => void;
    handleCreateStatus: (payload: PickCreateTaskStatus) => void;
    handleUpdateStatus: (id: string, payload: PickUpdateTaskStatusItem) => void;
    handleDeleteStatus: (id: string) => void;
    isPending: boolean;
  };
}

const PRESET_COLORS = [
  { name: 'Slate', value: '#64748b' },
  { name: 'Blue', value: '#3b82f6' },
  { name: 'Indigo', value: '#6366f1' },
  { name: 'Purple', value: '#8b5cf6' },
  { name: 'Pink', value: '#ec4899' },
  { name: 'Rose', value: '#f43f5e' },
  { name: 'Amber', value: '#f59e0b' },
  { name: 'Emerald', value: '#10b981' },
  { name: 'Cyan', value: '#06b6d4' },
];

export const TaskSection: React.FC<TaskSectionProps> = ({
  service: {
    tasks,
    statuses,
    isLoading,
    handleCreate,
    handleUpdate,
    handleStatusChange,
    handleDelete,
    handleCreateStatus,
    handleUpdateStatus,
    handleDeleteStatus,
    isPending,
  },
}) => {
  // Modal states for Task
  const [openCreateTaskModal, setOpenCreateTaskModal] = useState(false);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [taskStatusId, setTaskStatusId] = useState('');
  const [detailTask, setDetailTask] = useState<ITask | null>(null);
  const [editingTask, setEditingTask] = useState<ITask | null>(null);
  const [editTaskTitle, setEditTaskTitle] = useState('');
  const [editTaskDescription, setEditTaskDescription] = useState('');
  const [editTaskStatusId, setEditTaskStatusId] = useState('');

  // Modal states for Status
  const [openCreateStatusModal, setOpenCreateStatusModal] = useState(false);
  const [newStatusName, setNewStatusName] = useState('');
  const [newStatusColor, setNewStatusColor] = useState('#3b82f6');

  const [editingStatus, setEditingStatus] = useState<TaskStatusOption | null>(null);
  const [editStatusName, setEditStatusName] = useState('');
  const [editStatusColor, setEditStatusColor] = useState('#3b82f6');

  const [deletingStatus, setDeletingStatus] = useState<TaskStatusOption | null>(null);

  // Drag and drop states
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const [dragOverColId, setDragOverColId] = useState<string | null>(null);

  // Sorted statuses
  const sortedStatuses = [...statuses].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));

  // Open Create Task modal with initial valid status
  const handleOpenCreateTask = () => {
    setTaskTitle('');
    setTaskDescription('');
    setTaskStatusId(sortedStatuses[0]?.id || '');
    setOpenCreateTaskModal(true);
  };

  // Submit Create Task
  const onSubmitCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;

    const chosenStatusId = taskStatusId || sortedStatuses[0]?.id;
    if (!chosenStatusId) return;

    const plain = stripHtml(taskDescription);
    handleCreate({
      title: taskTitle.trim(),
      description: plain ? taskDescription : undefined,
      statusId: chosenStatusId,
    });

    setTaskTitle('');
    setTaskDescription('');
    setOpenCreateTaskModal(false);
  };

  // Open Edit Task modal
  const handleOpenEditTask = (task: ITask) => {
    setEditingTask(task);
    setEditTaskTitle(task.title);
    setEditTaskDescription(task.description || '');
    setEditTaskStatusId(task.statusId);
  };

  // Submit Edit Task
  const onSubmitEditTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTask || !editTaskTitle.trim()) return;

    const plain = stripHtml(editTaskDescription);
    handleUpdate(editingTask.id, {
      title: editTaskTitle.trim(),
      description: plain ? editTaskDescription : undefined,
      statusId: editTaskStatusId,
    });

    setEditingTask(null);
  };

  // Submit Create Status
  const onSubmitCreateStatus = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStatusName.trim()) return;

    handleCreateStatus({
      name: newStatusName.trim(),
      color: newStatusColor,
      sortOrder: sortedStatuses.length,
    });

    setNewStatusName('');
    setNewStatusColor('#3b82f6');
    setOpenCreateStatusModal(false);
  };

  // Open Edit Status
  const handleOpenEditStatus = (status: TaskStatusOption) => {
    setEditingStatus(status);
    setEditStatusName(status.name);
    setEditStatusColor(status.color || '#3b82f6');
  };

  // Submit Edit Status
  const onSubmitEditStatus = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStatus || !editStatusName.trim()) return;

    handleUpdateStatus(editingStatus.id, {
      name: editStatusName.trim(),
      color: editStatusColor,
    });

    setEditingStatus(null);
  };

  // Confirm Delete Status
  const handleConfirmDeleteStatus = () => {
    if (!deletingStatus) return;
    handleDeleteStatus(deletingStatus.id);
    setDeletingStatus(null);
  };

  // Drag and drop handlers
  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData('text/plain', taskId);
    e.dataTransfer.effectAllowed = 'move';
    setDraggedTaskId(taskId);
  };

  const handleDragEnd = () => {
    setDraggedTaskId(null);
    setDragOverColId(null);
  };

  const handleDragOver = (e: React.DragEvent, colId: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverColId !== colId) {
      setDragOverColId(colId);
    }
  };

  const handleDragLeave = (e: React.DragEvent, colId: string) => {
    if (e.currentTarget.contains(e.relatedTarget as Node)) return;
    if (dragOverColId === colId) {
      setDragOverColId(null);
    }
  };

  const handleDrop = (e: React.DragEvent, targetStatusId: string) => {
    e.preventDefault();
    setDragOverColId(null);
    const taskId = e.dataTransfer.getData('text/plain') || draggedTaskId;
    setDraggedTaskId(null);

    if (!taskId) return;
    const task = tasks.find((t) => t.id === taskId);
    if (!task || task.statusId === targetStatusId) return;

    handleStatusChange(taskId, targetStatusId);
  };

  return (
    <div className="w-full space-y-6">
      {/* Top Header & Global Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageHeader
          title="Task Management"
          description="Kanban board kolaborasi tim dengan status dinamis dan kemudahan drag-and-drop."
        />
        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant="outline"
            onClick={() => setOpenCreateStatusModal(true)}
            className="gap-2"
          >
            <Settings2 className="w-4 h-4 text-neutral-500" />
            Tambah Status
          </Button>
          <Button onClick={handleOpenCreateTask} className="gap-2">
            <Plus className="w-4 h-4" />
            Tambah Task
          </Button>
        </div>
      </div>

      {/* Kanban Board */}
      {isLoading ? (
        <div className="flex items-center justify-center min-h-[400px] border border-dashed border-neutral-200 dark:border-neutral-800 rounded-xl text-neutral-400 text-sm">
          Memuat data board dan status...
        </div>
      ) : sortedStatuses.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[360px] border border-dashed border-neutral-200 dark:border-neutral-800 rounded-xl p-8 text-center space-y-4">
          <Layers className="w-12 h-12 text-neutral-400 opacity-60" />
          <div className="space-y-1">
            <h3 className="text-base font-semibold text-neutral-800 dark:text-neutral-200">
              Belum ada status task
            </h3>
            <p className="text-xs text-neutral-500 max-w-sm">
              Buat status pertama (misal: To Do, In Progress, Done) untuk mulai mengorganisir tugas
              tim Anda.
            </p>
          </div>
          <Button onClick={() => setOpenCreateStatusModal(true)} className="gap-2">
            <Plus className="w-4 h-4" />
            Buat Status Sekarang
          </Button>
        </div>
      ) : (
        <div className="flex gap-5 overflow-x-auto pb-4 items-start">
          {sortedStatuses.map((col) => {
            const colTasks = tasks.filter((t) => t.statusId === col.id);
            const isDragOver = dragOverColId === col.id;

            return (
              <div
                key={col.id}
                onDragOver={(e) => handleDragOver(e, col.id)}
                onDragLeave={(e) => handleDragLeave(e, col.id)}
                onDrop={(e) => handleDrop(e, col.id)}
                className={`w-[320px] shrink-0 min-h-[560px] flex flex-col rounded-xl transition-all duration-150 border ${
                  isDragOver
                    ? 'border-blue-500 ring-2 ring-blue-500/20 bg-blue-50/20 dark:bg-blue-950/20'
                    : 'border-neutral-200/80 dark:border-neutral-800 bg-neutral-50/60 dark:bg-neutral-900/40'
                }`}
              >
                {/* Column Header */}
                <div className="p-3.5 pb-2.5 flex items-center justify-between border-b border-neutral-200/60 dark:border-neutral-800/60">
                  <div className="flex items-center gap-2 min-w-0">
                    <span
                      className="w-3 h-3 rounded-full shrink-0 shadow-xs"
                      style={{ backgroundColor: col.color || '#3b82f6' }}
                    />
                    <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 truncate">
                      {col.name}
                    </h3>
                    <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-neutral-200/70 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400">
                      {colTasks.length}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEditStatus(col)}
                      title="Edit status"
                      className="p-1 rounded text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-200/60 dark:hover:bg-neutral-800 transition"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setDeletingStatus(col)}
                      title="Hapus status"
                      className="p-1 rounded text-neutral-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Column Content / Drop Area */}
                <div className="p-3 flex-1 flex flex-col space-y-3 overflow-y-auto max-h-[700px]">
                  {colTasks.length === 0 ? (
                    <div
                      className={`flex flex-col items-center justify-center flex-1 rounded-lg border-2 border-dashed p-6 text-center transition-all ${
                        isDragOver
                          ? 'border-blue-400 bg-blue-50/30 dark:bg-blue-900/20 text-blue-500'
                          : 'border-neutral-200 dark:border-neutral-800/80 text-neutral-400'
                      }`}
                    >
                      <Layers className="w-7 h-7 mb-2 opacity-40" />
                      <span className="text-xs font-medium">Tarik task ke sini</span>
                    </div>
                  ) : (
                    colTasks.map((task) => {
                      const isDragging = draggedTaskId === task.id;

                      return (
                        <Card
                          key={task.id}
                          draggable
                          onDragStart={(e) => handleDragStart(e, task.id)}
                          onDragEnd={handleDragEnd}
                          className={`p-3.5 cursor-grab active:cursor-grabbing border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-xs hover:shadow-md transition-all group ${
                            isDragging
                              ? 'opacity-35 scale-95 border-blue-400 dark:border-blue-500'
                              : 'hover:border-neutral-300 dark:hover:border-neutral-700'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-start gap-1.5 flex-1 min-w-0">
                              <GripVertical className="w-4 h-4 text-neutral-300 group-hover:text-neutral-500 shrink-0 mt-0.5 transition" />
                              <h4
                                onClick={() => setDetailTask(task)}
                                className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer transition line-clamp-2"
                              >
                                {task.title}
                              </h4>
                            </div>

                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition shrink-0">
                              <button
                                onClick={() => handleOpenEditTask(task)}
                                title="Edit tugas"
                                className="text-neutral-400 hover:text-blue-600 transition p-1 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800"
                              >
                                <Pencil className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDelete(task.id)}
                                title="Hapus tugas"
                                className="text-neutral-400 hover:text-red-500 transition p-1 rounded hover:bg-red-50 dark:hover:bg-red-950/20"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          {task.description && (
                            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-2 line-clamp-2 pl-5.5">
                              {stripHtml(task.description)}
                            </p>
                          )}

                          {/* Card Footer: Quick Status Switcher */}
                          <div className="mt-3 pt-2.5 border-t border-neutral-100 dark:border-neutral-800/80 flex items-center justify-between text-xs pl-5.5">
                            <span className="text-[11px] text-neutral-400">Pindah Status:</span>
                            <select
                              value={task.statusId}
                              onChange={(e) => handleStatusChange(task.id, e.target.value)}
                              className="bg-neutral-50 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700 rounded px-2 py-0.5 text-xs outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
                            >
                              {sortedStatuses.map((s) => (
                                <option key={s.id} value={s.id}>
                                  {s.name}
                                </option>
                              ))}
                            </select>
                          </div>
                        </Card>
                      );
                    })
                  )}
                </div>

                {/* Column Quick Add Task */}
                <div className="p-2 border-t border-neutral-200/50 dark:border-neutral-800/50">
                  <button
                    onClick={() => {
                      setTaskStatusId(col.id);
                      setOpenCreateTaskModal(true);
                    }}
                    className="w-full py-1.5 px-3 rounded-lg text-xs font-medium text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-200/50 dark:hover:bg-neutral-800 transition flex items-center justify-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Tambah ke {col.name}
                  </button>
                </div>
              </div>
            );
          })}

          {/* Add New Status Column Placeholder */}
          <div
            onClick={() => setOpenCreateStatusModal(true)}
            className="w-[280px] shrink-0 min-h-[160px] rounded-xl border-2 border-dashed border-neutral-200 dark:border-neutral-800 hover:border-blue-400 dark:hover:border-blue-500 p-6 flex flex-col items-center justify-center gap-2 cursor-pointer transition bg-white/40 dark:bg-neutral-900/20 text-neutral-400 hover:text-blue-600 dark:hover:text-blue-400 group"
          >
            <Plus className="w-6 h-6 group-hover:scale-110 transition" />
            <span className="text-sm font-semibold">Tambah Kolom Status</span>
          </div>
        </div>
      )}

      {/* ================= MODAL: CREATE TASK ================= */}
      <Dialog open={openCreateTaskModal} onOpenChange={setOpenCreateTaskModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Tambah Task Baru</DialogTitle>
          </DialogHeader>
          <form onSubmit={onSubmitCreateTask} className="space-y-4 mt-2">
            <div className="space-y-2">
              <Label htmlFor="title">Judul Task *</Label>
              <Input
                id="title"
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
                placeholder="Contoh: Implementasi modul auth..."
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status Awal *</Label>
              <select
                id="status"
                value={taskStatusId || sortedStatuses[0]?.id || ''}
                onChange={(e) => setTaskStatusId(e.target.value)}
                className="w-full text-sm px-3 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg bg-transparent text-neutral-800 dark:text-neutral-200 outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                {sortedStatuses.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label>Deskripsi</Label>
              <RichTextEditor
                variant="compact"
                value={taskDescription}
                onChange={setTaskDescription}
                onUploadImage={(file) => uploadAvatar(file, 'task-images')}
                onDeleteImage={deleteObject}
                placeholder="Rincian task... (dapat menyisipkan gambar & tabel)"
                minHeight="min-h-[160px]"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => setOpenCreateTaskModal(false)}>
                Batal
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? 'Menyimpan...' : 'Simpan Task'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* ================= MODAL: EDIT TASK ================= */}
      <Dialog open={!!editingTask} onOpenChange={(open) => !open && setEditingTask(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
          </DialogHeader>
          <form onSubmit={onSubmitEditTask} className="space-y-4 mt-2">
            <div className="space-y-2">
              <Label htmlFor="edit-title">Judul Task *</Label>
              <Input
                id="edit-title"
                value={editTaskTitle}
                onChange={(e) => setEditTaskTitle(e.target.value)}
                placeholder="Judul task..."
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-status">Status *</Label>
              <select
                id="edit-status"
                value={editTaskStatusId}
                onChange={(e) => setEditTaskStatusId(e.target.value)}
                className="w-full text-sm px-3 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg bg-transparent text-neutral-800 dark:text-neutral-200 outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                {sortedStatuses.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label>Deskripsi</Label>
              <RichTextEditor
                variant="compact"
                value={editTaskDescription}
                onChange={setEditTaskDescription}
                onUploadImage={(file) => uploadAvatar(file, 'task-images')}
                onDeleteImage={deleteObject}
                placeholder="Rincian task..."
                minHeight="min-h-[160px]"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => setEditingTask(null)}>
                Batal
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? 'Menyimpan...' : 'Perbarui Task'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* ================= MODAL: DETAIL TASK ================= */}
      <Dialog open={!!detailTask} onOpenChange={(open) => !open && setDetailTask(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader className="space-y-1">
            <div className="flex items-center gap-2">
              {detailTask && (
                <Badge
                  style={{
                    backgroundColor:
                      statuses.find((s) => s.id === detailTask.statusId)?.color || '#3b82f6',
                    color: '#ffffff',
                  }}
                  className="font-medium"
                >
                  {statuses.find((s) => s.id === detailTask.statusId)?.name || 'Status'}
                </Badge>
              )}
            </div>
            <DialogTitle className="text-xl font-bold">{detailTask?.title}</DialogTitle>
          </DialogHeader>

          <div className="mt-4 space-y-4">
            <div>
              <Label className="text-xs text-neutral-400">Deskripsi</Label>
              {detailTask?.description ? (
                <div className="mt-1">
                  <RichTextEditor
                    variant="compact"
                    value={detailTask.description}
                    readOnly
                    minHeight="min-h-[120px]"
                  />
                </div>
              ) : (
                <p className="text-sm text-neutral-400 mt-1">Tidak ada rincian deskripsi.</p>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-neutral-100 dark:border-neutral-800">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  if (detailTask) {
                    const t = detailTask;
                    setDetailTask(null);
                    handleOpenEditTask(t);
                  }
                }}
                className="gap-1.5"
              >
                <Pencil className="w-3.5 h-3.5" />
                Edit Task
              </Button>
              <Button variant="default" size="sm" onClick={() => setDetailTask(null)}>
                Tutup
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* ================= MODAL: CREATE STATUS ================= */}
      <Dialog open={openCreateStatusModal} onOpenChange={setOpenCreateStatusModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Tambah Kolom Status Baru</DialogTitle>
          </DialogHeader>
          <form onSubmit={onSubmitCreateStatus} className="space-y-4 mt-2">
            <div className="space-y-2">
              <Label htmlFor="status-name">Nama Status *</Label>
              <Input
                id="status-name"
                value={newStatusName}
                onChange={(e) => setNewStatusName(e.target.value)}
                placeholder="Contoh: Code Review, Testing, Ready..."
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Warna Status</Label>
              <div className="flex flex-wrap items-center gap-2 mt-1">
                {PRESET_COLORS.map((c) => (
                  <button
                    key={c.value}
                    type="button"
                    onClick={() => setNewStatusColor(c.value)}
                    style={{ backgroundColor: c.value }}
                    className="w-7 h-7 rounded-full flex items-center justify-center transition hover:scale-110 shadow-xs"
                    title={c.name}
                  >
                    {newStatusColor === c.value && <Check className="w-4 h-4 text-white" />}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-2 mt-2">
                <Input
                  type="color"
                  value={newStatusColor}
                  onChange={(e) => setNewStatusColor(e.target.value)}
                  className="w-10 h-9 p-1 rounded cursor-pointer"
                />
                <Input
                  type="text"
                  value={newStatusColor}
                  onChange={(e) => setNewStatusColor(e.target.value)}
                  placeholder="#3b82f6"
                  className="flex-1 font-mono text-xs uppercase"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpenCreateStatusModal(false)}
              >
                Batal
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? 'Menyimpan...' : 'Buat Status'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* ================= MODAL: EDIT STATUS ================= */}
      <Dialog open={!!editingStatus} onOpenChange={(open) => !open && setEditingStatus(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Kolom Status</DialogTitle>
          </DialogHeader>
          <form onSubmit={onSubmitEditStatus} className="space-y-4 mt-2">
            <div className="space-y-2">
              <Label htmlFor="edit-status-name">Nama Status *</Label>
              <Input
                id="edit-status-name"
                value={editStatusName}
                onChange={(e) => setEditStatusName(e.target.value)}
                placeholder="Nama status..."
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Warna Status</Label>
              <div className="flex flex-wrap items-center gap-2 mt-1">
                {PRESET_COLORS.map((c) => (
                  <button
                    key={c.value}
                    type="button"
                    onClick={() => setEditStatusColor(c.value)}
                    style={{ backgroundColor: c.value }}
                    className="w-7 h-7 rounded-full flex items-center justify-center transition hover:scale-110 shadow-xs"
                    title={c.name}
                  >
                    {editStatusColor === c.value && <Check className="w-4 h-4 text-white" />}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-2 mt-2">
                <Input
                  type="color"
                  value={editStatusColor}
                  onChange={(e) => setEditStatusColor(e.target.value)}
                  className="w-10 h-9 p-1 rounded cursor-pointer"
                />
                <Input
                  type="text"
                  value={editStatusColor}
                  onChange={(e) => setEditStatusColor(e.target.value)}
                  placeholder="#3b82f6"
                  className="flex-1 font-mono text-xs uppercase"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => setEditingStatus(null)}>
                Batal
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? 'Menyimpan...' : 'Perbarui Status'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* ================= MODAL: DELETE STATUS CONFIRMATION ================= */}
      <Dialog open={!!deletingStatus} onOpenChange={(open) => !open && setDeletingStatus(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Hapus Status "{deletingStatus?.name}"?</DialogTitle>
          </DialogHeader>

          {deletingStatus && (
            <div className="space-y-4 mt-2">
              {sortedStatuses.length <= 1 ? (
                <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950/30 text-amber-800 dark:text-amber-200 text-sm flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 shrink-0 text-amber-500 mt-0.5" />
                  <span>
                    Status ini tidak dapat dihapus karena merupakan status satu-satunya. Perusahaan
                    minimal harus memiliki 1 status tugas.
                  </span>
                </div>
              ) : tasks.some((t) => t.statusId === deletingStatus.id) ? (
                <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950/30 text-amber-800 dark:text-amber-200 text-sm flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 shrink-0 text-amber-500 mt-0.5" />
                  <span>
                    Status ini masih digunakan oleh{' '}
                    <strong>
                      {tasks.filter((t) => t.statusId === deletingStatus.id).length} task
                    </strong>
                    . Pindahkan task-task tersebut ke status lain sebelum menghapus status ini.
                  </span>
                </div>
              ) : (
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  Apakah Anda yakin ingin menghapus kolom status{' '}
                  <strong>{deletingStatus.name}</strong>? Tindakan ini tidak dapat dibatalkan.
                </p>
              )}

              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" onClick={() => setDeletingStatus(null)}>
                  Batal
                </Button>
                {sortedStatuses.length > 1 &&
                  !tasks.some((t) => t.statusId === deletingStatus.id) && (
                    <Button
                      type="button"
                      variant="destructive"
                      onClick={handleConfirmDeleteStatus}
                      disabled={isPending}
                    >
                      {isPending ? 'Menghapus...' : 'Hapus Status'}
                    </Button>
                  )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
