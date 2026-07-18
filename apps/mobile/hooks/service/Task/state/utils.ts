import type { Task } from '@repo/types';
import type { QueryClient } from '@tanstack/react-query';

import { queryKey } from '@/config/query-key';

export type TaskCacheContext = {
  previousData?: Task[];
};

export function readTaskSnapshot(queryClient: QueryClient): Task[] | undefined {
  return queryClient.getQueryData<Task[]>(queryKey.tasks.list());
}
