import type {
  ICompanyMember,
  ITask,
  PickCreateTask,
  PickCreateTaskStatus,
  PickUpdateTask,
  PickUpdateTaskStatusItem,
  TaskStatusOption,
} from '@repo/types';
import {
  AlertCircle,
  Check,
  CheckCircle2,
  Clock,
  Eye,
  GripVertical,
  Layers,
  Palette,
  Pencil,
  Plus,
  Settings2,
  Sparkles,
  Trash2,
} from 'lucide-react';
import React, { useMemo, useState } from 'react';

import {
  Badge,
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
  WorkingStatusBadge,
} from '@/components/atoms';
import { RichTextEditor } from '@/components/molecules/editor/RichTextEditor';
import { PageHeader } from '@/components/molecules/PageHeader';
import { stripHtml } from '@/utils/html';
import { deleteObject, uploadAvatar } from '@/utils/r2-utils';

export interface TaskSectionProps {
  service: {
    tasks: ITask[];
    statuses: TaskStatusOption[];
    members: ICompanyMember[];
    statusMap: Map<string, any>;
    sortedStatuses: TaskStatusOption[];
    tasksByStatusId: Map<string, ITask[]>;
    countByStatusId: (statusId: string) => number;
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
    members = [],
    statusMap,
    sortedStatuses,
    tasksByStatusId,
    countByStatusId,
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
  const [taskAssigneeId, setTaskAssigneeId] = useState('');
  const [detailTask, setDetailTask] = useState<ITask | null>(null);

  const selectedAssignee = members.find((m) => m.id === taskAssigneeId);
  const selectedAssigneeStatus = selectedAssignee
    ? statusMap.get(selectedAssignee.id) || statusMap.get(selectedAssignee.userId)
    : null;
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
      assigneeIds: taskAssigneeId ? [taskAssigneeId] : undefined,
    });

    setTaskTitle('');
    setTaskDescription('');
    setTaskAssigneeId('');
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
            <Settings2 className="w-4 h-4 text-muted-foreground" />
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
        <div className="flex items-center justify-center min-h-[400px] border border-dashed border-border/70 rounded-2xl text-muted-foreground text-sm bg-card/40">
          Memuat data board dan status...
        </div>
      ) : sortedStatuses.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[360px] border border-dashed border-border/70 rounded-2xl p-8 text-center space-y-4 bg-card/40">
          <Layers className="w-12 h-12 text-muted-foreground opacity-60" />
          <div className="space-y-1">
            <h3 className="text-base font-semibold text-foreground">Belum ada status task</h3>
            <p className="text-xs text-muted-foreground max-w-sm">
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
            const colTasks = tasksByStatusId.get(col.id) ?? [];
            const isDragOver = dragOverColId === col.id;

            return (
              <div
                key={col.id}
                onDragOver={(e) => handleDragOver(e, col.id)}
                onDragLeave={(e) => handleDragLeave(e, col.id)}
                onDrop={(e) => handleDrop(e, col.id)}
                className={`w-[320px] shrink-0 min-h-[560px] flex flex-col rounded-2xl transition-all duration-150 border backdrop-blur-md ${
                  isDragOver
                    ? 'border-primary ring-2 ring-primary/20 bg-primary/5'
                    : 'border-border/60 bg-card/60'
                }`}
              >
                {/* Column Header */}
                <div className="p-3.5 pb-2.5 flex items-center justify-between border-b border-border/50">
                  <div className="flex items-center gap-2 min-w-0">
                    <span
                      className="w-3 h-3 rounded-full shrink-0 shadow-xs"
                      style={{ backgroundColor: col.color || 'var(--primary)' }}
                    />
                    <h3 className="text-sm font-semibold text-foreground truncate">{col.name}</h3>
                    <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-muted text-muted-foreground">
                      {colTasks.length}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEditStatus(col)}
                      title="Edit status"
                      className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setDeletingStatus(col)}
                      title="Hapus status"
                      className="p-1 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Column Content / Drop Area */}
                <div className="p-3 flex-1 flex flex-col space-y-3 overflow-y-auto max-h-[700px]">
                  {colTasks.length === 0 ? (
                    <div
                      className={`flex flex-col items-center justify-center flex-1 rounded-xl border-2 border-dashed p-6 text-center transition-all ${
                        isDragOver
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-border/50 text-muted-foreground'
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
                          padding="none"
                          className={`p-3.5 cursor-grab active:cursor-grabbing border rounded-2xl shadow-2xs hover:shadow-xs transition-all group backdrop-blur-md ${
                            isDragging
                              ? 'opacity-40 scale-95 border-primary ring-2 ring-primary/20 shadow-md'
                              : 'border-border/70 bg-card hover:border-primary/50 hover:-translate-y-0.5'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-start gap-1.5 flex-1 min-w-0">
                              <GripVertical className="w-4 h-4 text-muted-foreground/60 group-hover:text-muted-foreground shrink-0 mt-0.5 transition" />
                              <h4
                                onClick={() => setDetailTask(task)}
                                className="text-sm font-semibold text-foreground hover:text-primary cursor-pointer transition line-clamp-2"
                              >
                                {task.title}
                              </h4>
                            </div>

                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition shrink-0">
                              <button
                                onClick={() => handleOpenEditTask(task)}
                                title="Edit tugas"
                                className="text-muted-foreground hover:text-primary transition p-1 rounded-md hover:bg-muted"
                              >
                                <Pencil className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDelete(task.id)}
                                title="Hapus tugas"
                                className="text-muted-foreground hover:text-destructive transition p-1 rounded-md hover:bg-destructive/10"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          {task.description && (
                            <p className="text-xs text-muted-foreground mt-2 line-clamp-2 pl-5.5">
                              {stripHtml(task.description)}
                            </p>
                          )}

                          {/* Card Footer: Quick Status Switcher */}
                          <div className="mt-3 pt-2.5 border-t border-border/40 flex items-center justify-between text-xs pl-5.5">
                            <span className="text-[11px] text-muted-foreground">
                              Pindah Status:
                            </span>
                            <select
                              value={task.statusId}
                              onChange={(e) => handleStatusChange(task.id, e.target.value)}
                              className="bg-card text-foreground border border-input rounded-md px-2 py-0.5 text-xs outline-none focus:ring-1 focus:ring-ring cursor-pointer"
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
                <div className="p-2 border-t border-border/40">
                  <button
                    onClick={() => {
                      setTaskStatusId(col.id);
                      setOpenCreateTaskModal(true);
                    }}
                    className="w-full py-1.5 px-3 rounded-lg text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted/60 transition flex items-center justify-center gap-1.5"
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
            className="w-[280px] shrink-0 min-h-[160px] rounded-2xl border-2 border-dashed border-border/60 hover:border-primary/50 p-6 flex flex-col items-center justify-center gap-2 cursor-pointer transition bg-card/40 text-muted-foreground hover:text-primary group"
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
                className="w-full text-sm px-3 py-2 border border-input rounded-xl bg-muted/40 text-foreground outline-none focus:ring-2 focus:ring-ring"
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
              <Label htmlFor="assignee">Tugaskan Kepada (Assignee)</Label>
              <select
                id="assignee"
                value={taskAssigneeId}
                onChange={(e) => setTaskAssigneeId(e.target.value)}
                className="w-full text-sm px-3 py-2 border border-input rounded-xl bg-muted/40 text-foreground outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="">-- Pilih Anggota Tim (Opsional) --</option>
                {members.map((m) => {
                  const s = statusMap.get(m.id) || statusMap.get(m.userId);
                  const suffix = s ? ` [${s.statusLabel}]` : '';
                  return (
                    <option key={m.id} value={m.id}>
                      {m.user?.fullName || m.user?.email || m.id}
                      {suffix}
                    </option>
                  );
                })}
              </select>

              {selectedAssigneeStatus?.status === 'out_of_hours' && (
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-muted/60 border border-border/40 text-xs text-muted-foreground mt-1.5">
                  <Clock className="size-3.5 shrink-0" />
                  <span>
                    Rekan sedang di luar jam kerja. Tugas akan sampai{' '}
                    <strong className="text-foreground">
                      {selectedAssigneeStatus.statusLabel.replace(/^Kembali\s*/i, '')}
                    </strong>
                    .
                  </span>
                </div>
              )}
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
                className="w-full text-sm px-3 py-2 border border-input rounded-xl bg-muted/40 text-foreground outline-none focus:ring-2 focus:ring-ring"
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
                      statuses.find((s) => s.id === detailTask.statusId)?.color || 'var(--primary)',
                    color: 'var(--primary-foreground)',
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
              <Label className="text-xs text-muted-foreground">Deskripsi</Label>
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
                <p className="text-sm text-muted-foreground mt-1">Tidak ada rincian deskripsi.</p>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-border/50">
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
            <DialogTitle>Hapus Status &quot;{deletingStatus?.name}&quot;?</DialogTitle>
          </DialogHeader>

          {deletingStatus && (
            <div className="space-y-4 mt-2">
              {sortedStatuses.length <= 1 ? (
                <div className="p-3 rounded-xl border border-warning/30 bg-warning/10 text-foreground text-sm flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 shrink-0 text-warning mt-0.5" />
                  <span>
                    Status ini tidak dapat dihapus karena merupakan status satu-satunya. Perusahaan
                    minimal harus memiliki 1 status tugas.
                  </span>
                </div>
              ) : countByStatusId(deletingStatus.id) > 0 ? (
                <div className="p-3 rounded-xl border border-warning/30 bg-warning/10 text-foreground text-sm flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 shrink-0 text-warning mt-0.5" />
                  <span>
                    Status ini masih digunakan oleh{' '}
                    <strong>{countByStatusId(deletingStatus.id)} task</strong>. Pindahkan task-task
                    tersebut ke status lain sebelum menghapus status ini.
                  </span>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Apakah Anda yakin ingin menghapus kolom status{' '}
                  <strong>{deletingStatus.name}</strong>? Tindakan ini tidak dapat dibatalkan.
                </p>
              )}

              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" onClick={() => setDeletingStatus(null)}>
                  Batal
                </Button>
                {sortedStatuses.length > 1 && countByStatusId(deletingStatus.id) === 0 && (
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
