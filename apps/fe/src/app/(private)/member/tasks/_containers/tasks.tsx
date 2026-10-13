'use client';

import type {
  PickCreateTask,
  PickCreateTaskStatus,
  PickUpdateTask,
  PickUpdateTaskStatusItem,
} from '@repo/types';

import { TaskSection } from '@/components/page/private/member/tasks/task.section';
import { useTask } from '@/hooks/useApi/task/useTask';

export default function TasksContainer() {
  const { query, mutate } = useTask();
  const { data: tasks = [], isLoading: isLoadingTasks } = query.list();
  const { data: statuses = [], isLoading: isLoadingStatuses } = query.statuses();

  const createTask = mutate.create();
  const updateTask = mutate.update();
  const updateStatus = mutate.updateStatus();
  const deleteTask = mutate.delete();

  const createStatus = mutate.createStatus();
  const updateStatusItem = mutate.updateStatusItem();
  const deleteStatusItem = mutate.deleteStatusItem();

  const handleCreate = (payload: PickCreateTask) => {
    createTask.mutate(payload);
  };

  const handleUpdate = (id: string, payload: PickUpdateTask) => {
    updateTask.mutate({ id, payload });
  };

  const handleStatusChange = (id: string, statusId: string) => {
    updateStatus.mutate({
      id,
      payload: { statusId },
    });
  };

  const handleDelete = (id: string) => {
    deleteTask.mutate(id);
  };

  const handleCreateStatus = (payload: PickCreateTaskStatus) => {
    createStatus.mutate(payload);
  };

  const handleUpdateStatus = (id: string, payload: PickUpdateTaskStatusItem) => {
    updateStatusItem.mutate({ id, payload });
  };

  const handleDeleteStatus = (id: string) => {
    deleteStatusItem.mutate(id);
  };

  return (
    <TaskSection
      service={{
        tasks,
        statuses,
        isLoading: isLoadingTasks || isLoadingStatuses,
        handleCreate,
        handleUpdate,
        handleStatusChange,
        handleDelete,
        handleCreateStatus,
        handleUpdateStatus,
        handleDeleteStatus,
        isPending:
          createTask.isPending ||
          updateTask.isPending ||
          updateStatus.isPending ||
          deleteTask.isPending ||
          createStatus.isPending ||
          updateStatusItem.isPending ||
          deleteStatusItem.isPending,
      }}
    />
  );
}
