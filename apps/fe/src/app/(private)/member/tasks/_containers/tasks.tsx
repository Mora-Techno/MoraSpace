"use client";

import { useTask } from "@/hooks/useApi/task/useTask";
import { TaskSection } from "@/components/page/private/member/tasks/task.section";

export default function TasksContainer() {
  const { query, mutate } = useTask();
  const { data: tasks = [], isLoading } = query.list();
  const createTask = mutate.create();
  const updateStatus = mutate.updateStatus();
  const deleteTask = mutate.delete();

  const handleCreate = (payload: { title: string; description?: string; statusId: string }) => {
    createTask.mutate(payload);
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

  return (
    <TaskSection
      service={{
        tasks,
        isLoading,
        handleCreate,
        handleStatusChange,
        handleDelete,
        isPending: createTask.isPending,
      }}
    />
  );
}
