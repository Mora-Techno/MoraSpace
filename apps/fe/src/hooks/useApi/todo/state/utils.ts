import type { Todo } from '@repo/types';
import type { TodoQuery } from '@repo/types';

import { queryKey } from '@/configs';
import type { AppNameSpace } from '@/hooks/useAppNameSpace';

export type TodoCacheContext = {
  previousData?: Todo[];
};

export const todosListKey = (filters?: TodoQuery) => queryKey.todos.list(filters);

export function readTodoSnapshot(ns: AppNameSpace, filters?: TodoQuery): Todo[] | undefined {
  return ns.queryClient.getQueryData<Todo[]>(todosListKey(filters));
}

export const todoRootKey = queryKey.todosRoot();
