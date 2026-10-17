'use client';

import type {
  ICompanyMember,
  PickCreateTask,
  PickCreateTaskStatus,
  PickUpdateTask,
  PickUpdateTaskStatusItem,
} from '@repo/types';
import type { IModule, PickCreateModule, PickUpdateModule } from '@repo/types/module.types';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useMemo } from 'react';

import { TaskSection } from '@/components/page/private/member/tasks/task.section';
import { useTask } from '@/hooks/useApi/task/useTask';
import { useApi } from '@/hooks/useApi/useApi';
import { useWorkspaceSwitcher } from '@/hooks/useWorkspace';

interface TasksContainerProps {
  moduleId?: string;
}

export default function TasksContainer({ moduleId: propModuleId }: TasksContainerProps = {}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const moduleId = propModuleId ?? searchParams.get('moduleId');
  const basePath = pathname.includes('/owner/') ? '/owner/member/tasks' : '/member/tasks';

  const { query, mutate } = useTask();
  const api = useApi();
  const { isPersonalActive, currentWorkspaceRole } = useWorkspaceSwitcher();
  const canManageModules =
    isPersonalActive || currentWorkspaceRole === 'Owner' || currentWorkspaceRole === 'Admin';

  const { data: modules = [], isLoading: isLoadingModules } = api.module.query.get({
    type: 'TASK',
  });
  const activeModule = useMemo(
    () => modules.find((m: IModule) => m.id === moduleId) ?? null,
    [modules, moduleId],
  );

  const { data: tasks = [], isLoading: isLoadingTasks } = query.list(
    moduleId ? { moduleId } : undefined,
  );
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

  const createModule = api.module.mutate.create();
  const updateModule = api.module.mutate.update();
  const deleteModule = api.module.mutate.delete();

  const handleCreate = (payload: PickCreateTask) => {
    createTask.mutate({
      ...payload,
      moduleId: moduleId ?? undefined,
    });
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

  const handleSelectModule = (module: IModule) => {
    router.push(`${basePath}/${module.id}`);
  };

  const handleBackToModules = () => {
    router.push(basePath);
  };

  const handleSwitchModule = (module: IModule) => {
    router.push(`${basePath}/${module.id}`);
  };

  const handleCreateModule = async (payload: PickCreateModule) => {
    await createModule.mutateAsync(payload);
  };

  const handleUpdateModule = async (id: string, payload: PickUpdateModule) => {
    await updateModule.mutateAsync({ id, payload });
  };

  const handleDeleteModule = async (id: string) => {
    await deleteModule.mutateAsync(id);
    if (moduleId === id) {
      router.push(basePath);
    }
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
        moduleContext: {
          modules,
          activeModule,
          moduleId,
          isLoadingModules,
          canManageModules,
          onSelectModule: handleSelectModule,
          onBackToModules: handleBackToModules,
          onSwitchModule: handleSwitchModule,
          handleCreateModule,
          handleUpdateModule,
          handleDeleteModule,
        },
      }}
    />
  );
}
