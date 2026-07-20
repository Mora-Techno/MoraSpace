import type {
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
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Alert } from 'react-native';

import { queryKey } from '@/config/query-key';
import Api from '@/service/props.service';

import { readTaskSnapshot,TaskCacheContext } from './utils';

export function useCreateTask() {
  const queryClient = useQueryClient();
  return useMutation<TResponse<ITask>, Error, PickCreateTask, TaskCacheContext>({
    mutationFn: (payload) => Api.Task.CreateTask(payload),
    onSuccess: (res) => {
      Alert.alert('Sukses', res.message);
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: queryKey.tasksRoot() });
      return { previousData: readTaskSnapshot(queryClient) };
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKey.tasksRoot() });
    },
    onError: (err) => {
      Alert.alert('Error', err.message);
    },
  });
}

export function useUpdateTask() {
  const queryClient = useQueryClient();
  return useMutation<
    TResponse<ITask>,
    Error,
    { id: string; payload: PickUpdateTask },
    TaskCacheContext
  >({
    mutationFn: ({ id, payload }) => Api.Task.UpdateTask(id, payload),
    onSuccess: (res) => {
      Alert.alert('Sukses', res.message);
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: queryKey.tasksRoot() });
      return { previousData: readTaskSnapshot(queryClient) };
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKey.tasksRoot() });
    },
    onError: (err) => {
      Alert.alert('Error', err.message);
    },
  });
}

export function useDeleteTask() {
  const queryClient = useQueryClient();
  return useMutation<TResponse<ITask>, Error, string, TaskCacheContext>({
    mutationFn: (id) => Api.Task.DeleteTask(id),
    onSuccess: (res) => {
      Alert.alert('Sukses', res.message);
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: queryKey.tasksRoot() });
      return { previousData: readTaskSnapshot(queryClient) };
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKey.tasksRoot() });
    },
    onError: (err) => {
      Alert.alert('Error', err.message);
    },
  });
}

export function useAssignTask() {
  const queryClient = useQueryClient();
  return useMutation<
    TResponse<ITask>,
    Error,
    { id: string; payload: PickAssignTask },
    TaskCacheContext
  >({
    mutationFn: ({ id, payload }) => Api.Task.AssignTask(id, payload),
    onSuccess: (res) => {
      Alert.alert('Sukses', res.message);
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: queryKey.tasksRoot() });
      return { previousData: readTaskSnapshot(queryClient) };
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKey.tasksRoot() });
    },
    onError: (err) => {
      Alert.alert('Error', err.message);
    },
  });
}

export function useUpdateTaskStatus() {
  const queryClient = useQueryClient();
  return useMutation<
    TResponse<ITask>,
    Error,
    { id: string; payload: PickUpdateTaskStatus },
    TaskCacheContext
  >({
    mutationFn: ({ id, payload }) => Api.Task.UpdateStatus(id, payload),
    onSuccess: (res) => {
      Alert.alert('Sukses', res.message);
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: queryKey.tasksRoot() });
      return { previousData: readTaskSnapshot(queryClient) };
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKey.tasksRoot() });
    },
    onError: (err) => {
      Alert.alert('Error', err.message);
    },
  });
}

export function useAddTaskComment() {
  const queryClient = useQueryClient();
  return useMutation<
    TResponse<unknown>,
    Error,
    { id: string; payload: PickAddTaskComment },
    TaskCacheContext
  >({
    mutationFn: ({ id, payload }) => Api.Task.AddComment(id, payload),
    onSuccess: (res) => {
      Alert.alert('Sukses', res.message);
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: queryKey.tasksRoot() });
      return { previousData: readTaskSnapshot(queryClient) };
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKey.tasksRoot() });
    },
    onError: (err) => {
      Alert.alert('Error', err.message);
    },
  });
}

export function useCreateTaskChecklist() {
  const queryClient = useQueryClient();
  return useMutation<
    TResponse<unknown>,
    Error,
    { id: string; payload: PickCreateTaskChecklist },
    TaskCacheContext
  >({
    mutationFn: ({ id, payload }) => Api.Task.CreateChecklist(id, payload),
    onSuccess: (res) => {
      Alert.alert('Sukses', res.message);
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: queryKey.tasksRoot() });
      return { previousData: readTaskSnapshot(queryClient) };
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKey.tasksRoot() });
    },
    onError: (err) => {
      Alert.alert('Error', err.message);
    },
  });
}

export function useAddTaskAttachment() {
  const queryClient = useQueryClient();
  return useMutation<
    TResponse<unknown>,
    Error,
    { id: string; payload: PickAddTaskAttachment },
    TaskCacheContext
  >({
    mutationFn: ({ id, payload }) => Api.Task.AddAttachment(id, payload),
    onSuccess: (res) => {
      Alert.alert('Sukses', res.message);
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: queryKey.tasksRoot() });
      return { previousData: readTaskSnapshot(queryClient) };
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKey.tasksRoot() });
    },
    onError: (err) => {
      Alert.alert('Error', err.message);
    },
  });
}
