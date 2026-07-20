import {
  ITask,
  PickAddTaskAttachment,
  PickAddTaskComment,
  PickAssignTask,
  PickCreateTask,
  PickCreateTaskChecklist,
  PickUpdateTask,
  PickUpdateTaskStatus,
  TResponse,
} from '@repo/types';
import { useMutation } from '@tanstack/react-query';

import { queryKey } from '@/configs';
import { useAppNameSpace } from '@/hooks/useAppNameSpace';
import Api from '@/services/api';

import { readTaskSnapshot,TaskCacheContext } from './utils';

export function useCreateTask() {
  const ns = useAppNameSpace();
  return useMutation<TResponse<ITask>, Error, PickCreateTask, TaskCacheContext>({
    mutationFn: (payload) => Api.Task.CreateTask(payload),
    onSuccess: (res) => {
      ns.alert.toast({
        title: res.message,
        message: res.message,
        icon: 'success',
      });
    },
    onMutate: async () => {
      await ns.queryClient.cancelQueries({
        queryKey: queryKey.tasksRoot(),
      });
      return { previousData: readTaskSnapshot(ns) };
    },
    onSettled: async () => {
      await ns.queryClient.invalidateQueries({
        queryKey: queryKey.tasksRoot(),
      });
    },
    onError: (err) => {
      ns.alert.toast({
        title: err.message,
        message: err.message,
        icon: 'error',
      });
    },
  });
}

export function useUpdateTask() {
  const ns = useAppNameSpace();
  return useMutation<
    TResponse<ITask>,
    Error,
    { id: string; payload: PickUpdateTask },
    TaskCacheContext
  >({
    mutationFn: ({ id, payload }) => Api.Task.UpdateTask(id, payload),
    onSuccess: (res) => {
      ns.alert.toast({
        title: res.message,
        message: res.message,
        icon: 'success',
      });
    },
    onMutate: async () => {
      await ns.queryClient.cancelQueries({
        queryKey: queryKey.tasksRoot(),
      });
      return { previousData: readTaskSnapshot(ns) };
    },
    onSettled: async () => {
      await ns.queryClient.invalidateQueries({
        queryKey: queryKey.tasksRoot(),
      });
    },
    onError: (err) => {
      ns.alert.toast({
        title: err.message,
        message: err.message,
        icon: 'error',
      });
    },
  });
}

export function useDeleteTask() {
  const ns = useAppNameSpace();
  return useMutation<TResponse<ITask>, Error, string, TaskCacheContext>({
    mutationFn: (id) => Api.Task.DeleteTask(id),
    onSuccess: (res) => {
      ns.alert.toast({
        title: res.message,
        message: res.message,
        icon: 'success',
      });
    },
    onMutate: async () => {
      await ns.queryClient.cancelQueries({
        queryKey: queryKey.tasksRoot(),
      });
      return { previousData: readTaskSnapshot(ns) };
    },
    onSettled: async () => {
      await ns.queryClient.invalidateQueries({
        queryKey: queryKey.tasksRoot(),
      });
    },
    onError: (err) => {
      ns.alert.toast({
        title: err.message,
        message: err.message,
        icon: 'error',
      });
    },
  });
}

export function useAssignTask() {
  const ns = useAppNameSpace();
  return useMutation<
    TResponse<ITask>,
    Error,
    { id: string; payload: PickAssignTask },
    TaskCacheContext
  >({
    mutationFn: ({ id, payload }) => Api.Task.AssignTask(id, payload),
    onSuccess: (res) => {
      ns.alert.toast({
        title: res.message,
        message: res.message,
        icon: 'success',
      });
    },
    onMutate: async () => {
      await ns.queryClient.cancelQueries({
        queryKey: queryKey.tasksRoot(),
      });
      return { previousData: readTaskSnapshot(ns) };
    },
    onSettled: async () => {
      await ns.queryClient.invalidateQueries({
        queryKey: queryKey.tasksRoot(),
      });
    },
    onError: (err) => {
      ns.alert.toast({
        title: err.message,
        message: err.message,
        icon: 'error',
      });
    },
  });
}

export function useUpdateTaskStatus() {
  const ns = useAppNameSpace();
  return useMutation<
    TResponse<ITask>,
    Error,
    { id: string; payload: PickUpdateTaskStatus },
    TaskCacheContext
  >({
    mutationFn: ({ id, payload }) => Api.Task.UpdateStatus(id, payload),
    onSuccess: (res) => {
      ns.alert.toast({
        title: res.message,
        message: res.message,
        icon: 'success',
      });
    },
    onMutate: async () => {
      await ns.queryClient.cancelQueries({
        queryKey: queryKey.tasksRoot(),
      });
      return { previousData: readTaskSnapshot(ns) };
    },
    onSettled: async () => {
      await ns.queryClient.invalidateQueries({
        queryKey: queryKey.tasksRoot(),
      });
    },
    onError: (err) => {
      ns.alert.toast({
        title: err.message,
        message: err.message,
        icon: 'error',
      });
    },
  });
}

export function useAddTaskComment() {
  const ns = useAppNameSpace();
  return useMutation<
    TResponse<any>,
    Error,
    { id: string; payload: PickAddTaskComment },
    TaskCacheContext
  >({
    mutationFn: ({ id, payload }) => Api.Task.AddComment(id, payload),
    onSuccess: (res) => {
      ns.alert.toast({
        title: res.message,
        message: res.message,
        icon: 'success',
      });
    },
    onMutate: async () => {
      await ns.queryClient.cancelQueries({
        queryKey: queryKey.tasksRoot(),
      });
      return { previousData: readTaskSnapshot(ns) };
    },
    onSettled: async () => {
      await ns.queryClient.invalidateQueries({
        queryKey: queryKey.tasksRoot(),
      });
    },
    onError: (err) => {
      ns.alert.toast({
        title: err.message,
        message: err.message,
        icon: 'error',
      });
    },
  });
}

export function useCreateTaskChecklist() {
  const ns = useAppNameSpace();
  return useMutation<
    TResponse<any>,
    Error,
    { id: string; payload: PickCreateTaskChecklist },
    TaskCacheContext
  >({
    mutationFn: ({ id, payload }) => Api.Task.CreateChecklist(id, payload),
    onSuccess: (res) => {
      ns.alert.toast({
        title: res.message,
        message: res.message,
        icon: 'success',
      });
    },
    onMutate: async () => {
      await ns.queryClient.cancelQueries({
        queryKey: queryKey.tasksRoot(),
      });
      return { previousData: readTaskSnapshot(ns) };
    },
    onSettled: async () => {
      await ns.queryClient.invalidateQueries({
        queryKey: queryKey.tasksRoot(),
      });
    },
    onError: (err) => {
      ns.alert.toast({
        title: err.message,
        message: err.message,
        icon: 'error',
      });
    },
  });
}

export function useAddTaskAttachment() {
  const ns = useAppNameSpace();
  return useMutation<
    TResponse<any>,
    Error,
    { id: string; payload: PickAddTaskAttachment },
    TaskCacheContext
  >({
    mutationFn: ({ id, payload }) => Api.Task.AddAttachment(id, payload),
    onSuccess: (res) => {
      ns.alert.toast({
        title: res.message,
        message: res.message,
        icon: 'success',
      });
    },
    onMutate: async () => {
      await ns.queryClient.cancelQueries({
        queryKey: queryKey.tasksRoot(),
      });
      return { previousData: readTaskSnapshot(ns) };
    },
    onSettled: async () => {
      await ns.queryClient.invalidateQueries({
        queryKey: queryKey.tasksRoot(),
      });
    },
    onError: (err) => {
      ns.alert.toast({
        title: err.message,
        message: err.message,
        icon: 'error',
      });
    },
  });
}
