import { MODULE_QUERY } from "@repo/config/query-stale";
import type { TodoQuery } from "@repo/types";
import { useQuery } from "@tanstack/react-query";

import { queryKey } from "@/configs";
import Api from "@/services/api";

import { todosListKey } from "./utils";

export function useTodos(filters?: TodoQuery) {
  return useQuery({
    queryKey: todosListKey(filters),
    queryFn: async () => {
      const res = await Api.Todo.ListTodos(filters);
      return res.data;
    },
    staleTime: MODULE_QUERY,
  });
}

export function useTodo(id: string) {
  return useQuery({
    queryKey: queryKey.todos.detail(id),
    queryFn: async () => {
      const res = await Api.Todo.GetTodo(id);
      return res.data;
    },
    staleTime: MODULE_QUERY,
    enabled: !!id,
  });
}
