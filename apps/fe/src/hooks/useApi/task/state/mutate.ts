import type {
  ITask,
  PickAddTaskAttachment,
  PickAddTaskComment,
  PickAssignTask,
  PickCreateTask,
  PickCreateTaskChecklist,
  PickCreateTaskStatus,
  PickUpdateTask,
  PickUpdateTaskStatus,
  PickUpdateTaskStatusItem,
  TaskStatusOption,
} from '@repo/types';

import { queryKey } from '@/configs';
import { useAppMutation } from '@/hooks/useAppMutation';
import Api from '@/services/api';

import { readTaskSnapshot, type TaskCacheContext } from './utils';

export function useCreateTask() {
  return useAppMutation<ITask, PickCreateTask, TaskCacheContext>({
    mutationFn: (payload) => Api.Task.CreateTask(payload),
    invalidateKeys: [queryKey.tasksRoot()],
    optimistic: (ns) => ({ previousData: readTaskSnapshot(ns) }),
    onSuccess: (res, _variables, _ctx, ns) => {
      ns.alert.toast({
        title: 'Berhasil',
        message: res.message || 'Tugas berhasil dibuat',
        icon: 'success',
      });
    },
    onError: (err: any, _variables, _ctx, ns) => {
      ns.alert.toast({
        title: 'Gagal',
        message: err.message || 'Gagal membuat tugas',
        icon: 'error',
      });
    },
  });
}

export function useUpdateTask() {
  return useAppMutation<ITask, { id: string; payload: PickUpdateTask }, TaskCacheContext>({
    mutationFn: ({ id, payload }) => Api.Task.UpdateTask(id, payload),
    invalidateKeys: [queryKey.tasksRoot()],
    optimistic: (ns) => ({ previousData: readTaskSnapshot(ns) }),
    onSuccess: (res, _variables, _ctx, ns) => {
      ns.alert.toast({
        title: 'Berhasil',
        message: res.message || 'Tugas berhasil diperbarui',
        icon: 'success',
      });
    },
    onError: (err: any, _variables, _ctx, ns) => {
      ns.alert.toast({
        title: 'Gagal',
        message: err.message || 'Gagal memperbarui tugas',
        icon: 'error',
      });
    },
  });
}

export function useDeleteTask() {
  return useAppMutation<ITask, string, TaskCacheContext>({
    mutationFn: (id) => Api.Task.DeleteTask(id),
    invalidateKeys: [queryKey.tasksRoot()],
    optimistic: (ns) => ({ previousData: readTaskSnapshot(ns) }),
    onSuccess: (res, _variables, _ctx, ns) => {
      ns.alert.toast({
        title: 'Berhasil',
        message: res.message || 'Tugas berhasil dihapus',
        icon: 'success',
      });
    },
    onError: (err: any, _variables, _ctx, ns) => {
      ns.alert.toast({
        title: 'Gagal',
        message: err.message || 'Gagal menghapus tugas',
        icon: 'error',
      });
    },
  });
}

export function useAssignTask() {
  return useAppMutation<ITask, { id: string; payload: PickAssignTask }, TaskCacheContext>({
    mutationFn: ({ id, payload }) => Api.Task.AssignTask(id, payload),
    invalidateKeys: [queryKey.tasksRoot()],
    optimistic: (ns) => ({ previousData: readTaskSnapshot(ns) }),
  });
}

export function useUpdateTaskStatus() {
  return useAppMutation<ITask, { id: string; payload: PickUpdateTaskStatus }, TaskCacheContext>({
    mutationFn: ({ id, payload }) => Api.Task.UpdateStatus(id, payload),
    invalidateKeys: [queryKey.tasksRoot()],
    optimistic: (ns) => ({ previousData: readTaskSnapshot(ns) }),
    onSuccess: (res, _variables, _ctx, ns) => {
      ns.alert.toast({
        title: 'Berhasil',
        message: res.message || 'Status tugas berhasil diperbarui',
        icon: 'success',
      });
    },
    onError: (err: any, _variables, _ctx, ns) => {
      ns.alert.toast({
        title: 'Gagal',
        message: err.message || 'Gagal memperbarui status tugas',
        icon: 'error',
      });
    },
  });
}

export function useCreateTaskStatus() {
  return useAppMutation<TaskStatusOption, PickCreateTaskStatus, TaskCacheContext>({
    mutationFn: (payload) => Api.Task.CreateStatus(payload),
    invalidateKeys: [queryKey.tasksRoot()],
    optimistic: (ns) => ({ previousData: readTaskSnapshot(ns) }),
    onSuccess: (res, _variables, _ctx, ns) => {
      ns.alert.toast({
        title: 'Berhasil',
        message: res.message || 'Status baru berhasil dibuat',
        icon: 'success',
      });
    },
    onError: (err: any, _variables, _ctx, ns) => {
      ns.alert.toast({
        title: 'Gagal',
        message: err.message || 'Gagal membuat status baru',
        icon: 'error',
      });
    },
  });
}

export function useUpdateTaskStatusItem() {
  return useAppMutation<
    TaskStatusOption,
    { id: string; payload: PickUpdateTaskStatusItem },
    TaskCacheContext
  >({
    mutationFn: ({ id, payload }) => Api.Task.UpdateStatusItem(id, payload),
    invalidateKeys: [queryKey.tasksRoot()],
    optimistic: (ns) => ({ previousData: readTaskSnapshot(ns) }),
    onSuccess: (res, _variables, _ctx, ns) => {
      ns.alert.toast({
        title: 'Berhasil',
        message: res.message || 'Status berhasil diperbarui',
        icon: 'success',
      });
    },
    onError: (err: any, _variables, _ctx, ns) => {
      ns.alert.toast({
        title: 'Gagal',
        message: err.message || 'Gagal memperbarui status',
        icon: 'error',
      });
    },
  });
}

export function useDeleteTaskStatusItem() {
  return useAppMutation<any, string, TaskCacheContext>({
    mutationFn: (id) => Api.Task.DeleteStatusItem(id),
    invalidateKeys: [queryKey.tasksRoot()],
    optimistic: (ns) => ({ previousData: readTaskSnapshot(ns) }),
    onSuccess: (res, _variables, _ctx, ns) => {
      ns.alert.toast({
        title: 'Berhasil',
        message: res.message || 'Status berhasil dihapus',
        icon: 'success',
      });
    },
    onError: (err: any, _variables, _ctx, ns) => {
      ns.alert.toast({
        title: 'Gagal',
        message: err.message || 'Gagal menghapus status',
        icon: 'error',
      });
    },
  });
}

export function useAddTaskComment() {
  return useAppMutation<any, { id: string; payload: PickAddTaskComment }, TaskCacheContext>({
    mutationFn: ({ id, payload }) => Api.Task.AddComment(id, payload),
    invalidateKeys: [queryKey.tasksRoot()],
    optimistic: (ns) => ({ previousData: readTaskSnapshot(ns) }),
  });
}

export function useCreateTaskChecklist() {
  return useAppMutation<any, { id: string; payload: PickCreateTaskChecklist }, TaskCacheContext>({
    mutationFn: ({ id, payload }) => Api.Task.CreateChecklist(id, payload),
    invalidateKeys: [queryKey.tasksRoot()],
    optimistic: (ns) => ({ previousData: readTaskSnapshot(ns) }),
  });
}

export function useAddTaskAttachment() {
  return useAppMutation<any, { id: string; payload: PickAddTaskAttachment }, TaskCacheContext>({
    mutationFn: ({ id, payload }) => Api.Task.AddAttachment(id, payload),
    invalidateKeys: [queryKey.tasksRoot()],
    optimistic: (ns) => ({ previousData: readTaskSnapshot(ns) }),
  });
}
