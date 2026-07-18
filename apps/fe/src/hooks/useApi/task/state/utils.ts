import type { Task } from '@repo/types';

import { queryKey } from '@/configs';
import type { AppNameSpace } from '@/hooks/useAppNameSpace';

export type TaskCacheContext = {
  previousData?: Task[];
};

export function readTaskSnapshot(ns: AppNameSpace): Task[] | undefined {
  return ns.queryClient.getQueryData<Task[]>(queryKey.tasks.list());
}
