import type { QueryClient } from '@tanstack/react-query';
import type { Todo } from '@repo/types';
import type { TodoQuery } from '@repo/types/todo.types';
import { queryKey } from '@/config/query-key';

export type TodoCacheContext = {
  previousData?: Todo[];
};

export const todosListKey = (filters?: TodoQuery) => queryKey.todos.list(filters);
export const todoRootKey = queryKey.todosRoot();

export function readTodoSnapshot(
  queryClient: QueryClient,
  filters?: TodoQuery,
): Todo[] | undefined {
  return queryClient.getQueryData<Todo[]>(todosListKey(filters));
}
