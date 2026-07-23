import type { ITask } from '@repo/types';
import type { QueryClient } from '@tanstack/react-query';

import { queryKey } from '@/config/query-key';

export type TaskCacheContext = {
  previousData?: ITask[];
};

export function readTaskSnapshot(queryClient: QueryClient): ITask[] | undefined {
  return queryClient.getQueryData<ITask[]>(queryKey.tasks.list());
}
