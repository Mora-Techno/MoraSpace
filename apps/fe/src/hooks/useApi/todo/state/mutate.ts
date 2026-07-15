import type { PickCreateTodo, PickUpdateTodo, Todo } from '@repo/types';
import type { PickApiID } from '@repo/types/api.types';
import { useMutation } from '@tanstack/react-query';

import { queryKey } from '@/configs';
import { useAppNameSpace } from '@/hooks/useAppNameSpace';
import Api from '@/services/api';
import type { TResponse } from '@/types/api/response';

import { readTodoSnapshot, type TodoCacheContext } from './utils';
import { todoRootKey } from './utils';

export function useCreateTodo(filters?: Parameters<typeof readTodoSnapshot>[1]) {
  const ns = useAppNameSpace();

  return useMutation<TResponse<Todo>, Error, PickCreateTodo, TodoCacheContext>({
    mutationFn: (payload) => Api.Todo.CreateTodo(payload),
    onMutate: async () => {
      await ns.queryClient.cancelQueries({ queryKey: todoRootKey });
      return { previousData: readTodoSnapshot(ns, filters) };
    },
    onSuccess: (res) => {
      ns.alert.toast({
        title: res.message,
        message: res.message,
        icon: 'success',
      });
    },
    onSettled: async () => {
      await ns.queryClient.invalidateQueries({
        queryKey: todoRootKey,
      });
    },
    onError: (err, _variables, context) => {
      if (context?.previousData !== undefined) {
        ns.queryClient.setQueryData(queryKey.todos.list(filters), context.previousData);
      }
      ns.alert.toast({
        title: err.message,
        message: err.message,
        icon: 'error',
      });
    },
  });
}

export function useDeleteTodo() {
  const ns = useAppNameSpace();

  return useMutation<TResponse<Todo>, Error, PickApiID, TodoCacheContext>({
    mutationFn: ({ id }) => Api.Todo.DeleteTodo(id),
    onMutate: async (_variables) => {
      await ns.queryClient.cancelQueries({ queryKey: todoRootKey });
      return { previousData: readTodoSnapshot(ns) };
    },
    onSuccess: (res) => {
      ns.alert.toast({
        title: res.message,
        message: res.message,
        icon: 'success',
      });
    },
    onSettled: async () => {
      await ns.queryClient.invalidateQueries({
        queryKey: todoRootKey,
      });
    },
    onError: (err, _variables, context) => {
      if (context?.previousData !== undefined) {
        ns.queryClient.setQueryData(todoRootKey, context.previousData);
      }
      ns.alert.toast({
        title: err.message,
        message: err.message,
        icon: 'error',
      });
    },
  });
}

export function useUpdateTodo() {
  const ns = useAppNameSpace();

  return useMutation<
    TResponse<Todo>,
    Error,
    { id: PickApiID; payload: PickUpdateTodo },
    TodoCacheContext
  >({
    mutationFn: ({ id, payload }) => Api.Todo.UpdateTodo(id.id, payload),
    onMutate: async () => {
      await ns.queryClient.cancelQueries({ queryKey: todoRootKey });
      return { previousData: readTodoSnapshot(ns) };
    },
    onSuccess: (res) => {
      ns.alert.toast({
        title: res.message,
        message: res.message,
        icon: 'success',
      });
    },
    onSettled: async () => {
      await ns.queryClient.invalidateQueries({
        queryKey: todoRootKey,
      });
    },
    onError: (err, _variables, context) => {
      if (context?.previousData !== undefined) {
        ns.queryClient.setQueryData(todoRootKey, context.previousData);
      }
      ns.alert.toast({
        title: err.message,
        message: err.message,
        icon: 'error',
      });
    },
  });
}
