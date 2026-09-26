import type {
  PickCreateTodo,
  PickUpdateTodo,
  Todo,
  TodoQuery,
} from "@repo/types";
import { useAppMutation } from "@/hooks/useAppMutation";
import Api from "@/service/props.service";
import {
  readTodoSnapshot,
  type TodoCacheContext,
  todoRootKey,
  todosListKey,
} from "./utils";

export function useCreateTodo(filters?: TodoQuery) {
  return useAppMutation<Todo, PickCreateTodo, TodoCacheContext>({
    mutationFn: (payload) => Api.Todo.CreateTodo(payload),
    invalidateKeys: [todoRootKey],
    optimistic: (ns) => ({ previousData: readTodoSnapshot(ns, filters) }),
    onError: (err, _vars, context, ns) => {
      if (context?.previousData !== undefined) {
        ns.queryClient.setQueryData(todosListKey(filters), context.previousData);
      }
      ns.alert.toast({
        title: "Error",
        message: err.message,
        icon: "error",
      });
    },
  });
}

export function useDeleteTodo() {
  return useAppMutation<Todo, string, TodoCacheContext>({
    mutationFn: (id) => Api.Todo.DeleteTodo(id),
    invalidateKeys: [todoRootKey],
    optimistic: (ns) => ({ previousData: readTodoSnapshot(ns) }),
    onError: (err, _vars, context, ns) => {
      if (context?.previousData !== undefined) {
        ns.queryClient.setQueryData(todoRootKey, context.previousData);
      }
      ns.alert.toast({
        title: "Error",
        message: err.message,
        icon: "error",
      });
    },
  });
}

export function useUpdateTodo(filters?: TodoQuery) {
  return useAppMutation<
    Todo,
    ({ id: string } & PickUpdateTodo) | { id: string; payload: PickUpdateTodo },
    TodoCacheContext
  >({
    mutationFn: (variables) => {
      const id = variables.id;
      const payload = "payload" in variables ? variables.payload : variables;
      return Api.Todo.UpdateTodo(id, payload);
    },
    invalidateKeys: [todoRootKey],
    optimistic: (ns) => ({ previousData: readTodoSnapshot(ns, filters) }),
    onError: (err, _vars, context, ns) => {
      if (context?.previousData !== undefined) {
        ns.queryClient.setQueryData(todosListKey(filters), context.previousData);
      }
      ns.alert.toast({
        title: "Error",
        message: err.message,
        icon: "error",
      });
    },
  });
}
