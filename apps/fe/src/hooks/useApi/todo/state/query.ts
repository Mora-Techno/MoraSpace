import { MODULE_QUERY } from '@repo/config/query-stale';
import type { TodoQuery } from '@repo/types';
import { useQuery } from '@tanstack/react-query';

import Api from '@/services/api';

import { todosListKey } from './utils';

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
