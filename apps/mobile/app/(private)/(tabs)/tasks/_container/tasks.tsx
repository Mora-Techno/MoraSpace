import type { ITask, PickCreateTask, TaskStatusOption } from '@repo/types/task.types';
import { useMemo, useState } from 'react';
import { Alert } from 'react-native';

import { TasksSection } from '@/components/section/private/tasks/tasks.section';
import { useTask } from '@/hooks/service/Task/useTask';
import { useApi } from '@/hooks/service/useApi';
import { useAppSelector } from '@/hooks/toolkit/redux';

export function MobileTasksContainer() {
  const currentUser = useAppSelector((state) => state.auth.currentUser?.user);
  const isOwner = currentUser?.companyRole?.toLowerCase() === 'owner';

  const { query, mutate } = useTask();
  const { data: rawTasks = [], isLoading, isError, refetch, isFetching } = query.list();
  const { data: rawStatuses = [] } = query.statuses();

  const createTask = mutate.create();
  const updateStatus = mutate.updateStatus();
  const deleteTask = mutate.delete();

  // Status default fallback jika API statuses belum di-seed
  const statuses: TaskStatusOption[] = useMemo(() => {
    if (rawStatuses && rawStatuses.length > 0) {
      return rawStatuses;
    }
    return [
      { id: 'todo', companyId: '', name: 'To Do', color: '#64748b', sortOrder: 1 },
      { id: 'in_progress', companyId: '', name: 'In Progress', color: '#3b82f6', sortOrder: 2 },
      { id: 'done', companyId: '', name: 'Done', color: '#10b981', sortOrder: 3 },
    ];
  }, [rawStatuses]);

  const api = useApi();
  const { data: members = [] } = api.member.query.list();
  const { data: rawMemberStatuses = [] } = api.workingHours.query.memberStatus();

  const [activeStatusId, setActiveStatusId] = useState<string>('all');
  const [modalVisible, setModalVisible] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newStatusId, setNewStatusId] = useState('');
  const [newAssigneeId, setNewAssigneeId] = useState('');

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

  const selectedAssignee = (members as any[]).find((m) => m.id === newAssigneeId);
  const selectedAssigneeStatus = selectedAssignee
    ? statusMap.get(selectedAssignee.id) || statusMap.get(selectedAssignee.userId)
    : null;

  // Visibilitas ditegakkan server (v0.0.1: Owner = semua, Member = own
  // reporter/assignee). Klien tidak filter ulang agar tugas assignee tak hilang.
  const accessibleTasks = useMemo(() => {
    if (!Array.isArray(rawTasks)) return [];
    return rawTasks;
  }, [rawTasks]);

  const counts = useMemo(() => {
    const byStatus: Record<string, number> = {};
    for (const t of accessibleTasks) {
      byStatus[t.statusId] = (byStatus[t.statusId] ?? 0) + 1;
    }
    return { all: accessibleTasks.length, byStatus };
  }, [accessibleTasks]);

  const displayedTasks = useMemo(() => {
    if (activeStatusId === 'all') return accessibleTasks;
    return accessibleTasks.filter((task) => task.statusId === activeStatusId);
  }, [accessibleTasks, activeStatusId]);

  const handleCreate = () => {
    if (!newTitle.trim()) {
      Alert.alert('Validasi', 'Judul tugas wajib diisi.');
      return;
    }

    const payloadStatusId = newStatusId || statuses[0]?.id || 'todo';
    const payload: PickCreateTask = {
      title: newTitle.trim(),
      description: newDescription.trim() || undefined,
      statusId: payloadStatusId,
      assigneeIds: newAssigneeId ? [newAssigneeId] : undefined,
    };

    createTask.mutate(payload, {
      onSuccess: () => {
        setNewTitle('');
        setNewDescription('');
        setNewAssigneeId('');
        setModalVisible(false);
      },
      onError: (err: any) => {
        Alert.alert('Gagal', err?.message || 'Gagal membuat tugas.');
      },
    });
  };

  const handleStatusChange = (taskId: string, targetStatusId: string) => {
    updateStatus.mutate({
      id: taskId,
      payload: { statusId: targetStatusId },
    });
  };

  const handleDelete = (id: string) => {
    Alert.alert('Hapus Tugas', 'Tugas yang dihapus tidak dapat dipulihkan.', [
      { text: 'Batal', style: 'cancel' },
      {
        text: 'Hapus',
        style: 'destructive',
        onPress: () => deleteTask.mutate(id),
      },
    ]);
  };

  return (
    <TasksSection
      service={{
        isOwner,
        tasks: displayedTasks as ITask[],
        statuses,
        members,
        statusMap,
        counts,
        isLoading,
        isError,
        isFetching,
        createPending: createTask.isPending,
        deletePending: deleteTask.isPending,
        selectedAssigneeStatus,
        onRetry: () => refetch(),
        onAddOpen: () => {
          setNewStatusId(statuses[0]?.id || '');
          setModalVisible(true);
        },
        onStatusTab: setActiveStatusId,
        onStatusChange: handleStatusChange,
        onDelete: handleDelete,
        onSubmitCreate: handleCreate,
        onToggleAssignee: (id) => setNewAssigneeId(id),
      }}
      state={{
        activeStatusId,
        modalVisible,
        setModalVisible,
        newTitle,
        setNewTitle,
        newDescription,
        setNewDescription,
        newStatusId,
        setNewStatusId,
        newAssigneeId,
        setNewAssigneeId,
      }}
    />
  );
}
