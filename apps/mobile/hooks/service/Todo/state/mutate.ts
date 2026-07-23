import type { PickCreateTodo, PickUpdateTodo, Todo, TodoQuery } from '@repo/types';
import type { TResponse } from '@repo/types/response.types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Alert } from 'react-native';

import Api from '@/service/props.service';

import { readTodoSnapshot, type TodoCacheContext, todoRootKey, todosListKey } from './utils';

export function useCreateTodo(filters?: TodoQuery) {
  const queryClient = useQueryClient();

  return useMutation<TResponse<Todo>, Error, PickCreateTodo, TodoCacheContext>({
    mutationFn: (payload) => Api.Todo.CreateTodo(payload),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: todoRootKey });
      return { previousData: readTodoSnapshot(queryClient, filters) };
    },
    onSuccess: (res) => {
      Alert.alert('Sukses', res.message);
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: todoRootKey });
    },
    onError: (err, _variables, context) => {
      if (context?.previousData !== undefined) {
        queryClient.setQueryData(todosListKey(filters), context.previousData);
      }
      Alert.alert('Error', err.message);
    },
  });
}

export function useDeleteTodo() {
  const queryClient = useQueryClient();

  return useMutation<TResponse<Todo>, Error, string, TodoCacheContext>({
    mutationFn: (id) => Api.Todo.DeleteTodo(id),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: todoRootKey });
      return { previousData: readTodoSnapshot(queryClient) };
    },
    onSuccess: (res) => {
      Alert.alert('Sukses', res.message);
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: todoRootKey });
    },
    onError: (err, _variables, context) => {
      if (context?.previousData !== undefined) {
        queryClient.setQueryData(todoRootKey, context.previousData);
      }
      Alert.alert('Error', err.message);
    },
  });
}

export function useUpdateTodo() {
  const queryClient = useQueryClient();

  return useMutation<
    TResponse<Todo>,
    Error,
    { id: string; payload: PickUpdateTodo },
    TodoCacheContext
  >({
    mutationFn: ({ id, payload }) => Api.Todo.UpdateTodo(id, payload),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: todoRootKey });
      return { previousData: readTodoSnapshot(queryClient) };
    },
    onSuccess: (res) => {
      Alert.alert('Sukses', res.message);
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: todoRootKey });
    },
    onError: (err, _variables, context) => {
      if (context?.previousData !== undefined) {
        queryClient.setQueryData(todoRootKey, context.previousData);
      }
      Alert.alert('Error', err.message);
    },
  });
}
