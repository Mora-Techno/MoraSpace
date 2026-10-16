'use client';

import type {
  ICompanyMember,
  PickCreateTask,
  PickCreateTaskStatus,
  PickUpdateTask,
  PickUpdateTaskStatusItem,
} from '@repo/types';
import { useMemo } from 'react';

import { TaskSection } from '@/components/page/private/member/tasks/task.section';
import { useTask } from '@/hooks/useApi/task/useTask';
import { useApi } from '@/hooks/useApi/useApi';

export default function TasksContainer() {
  const { query, mutate } = useTask();
  const api = useApi();
  const { data: tasks = [], isLoading: isLoadingTasks } = query.list();
  const { data: statuses = [], isLoading: isLoadingStatuses } = query.statuses();
  const { data: members = [] } = api.member.query.list();
  const { data: rawMemberStatuses = [] } = api.workingHours.query.memberStatus();

  const statusMap = useMemo(() => {
    const map = new Map<string, any>();
    const list = Array.isArray(rawMemberStatuses) ? rawMemberStatuses : [rawMemberStatuses];
    for (const s of list) {
      if (!s) continue;
      if (s.companyMemberId) map.set(s.companyMemberId, s);
      if (s.userId) map.set(s.userId, s);
    }
    return map;
  }, [rawMemberStatuses]);

  const sortedStatuses = useMemo(
    () => [...statuses].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0)),
    [statuses],
  );

  const tasksByStatusId = useMemo(() => {
    const map = new Map<string, typeof tasks>();
    for (const t of tasks) {
      const list = map.get(t.statusId) ?? [];
      list.push(t);
      map.set(t.statusId, list);
    }
    return map;
  }, [tasks]);

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
        members: members as ICompanyMember[],
        statusMap,
        sortedStatuses,
        tasksByStatusId,
        countByStatusId: (statusId: string) => tasksByStatusId.get(statusId)?.length ?? 0,
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
