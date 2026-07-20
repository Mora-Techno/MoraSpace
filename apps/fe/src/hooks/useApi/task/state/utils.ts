import type { ITask } from '@repo/types';

import { queryKey } from '@/configs';
import type { AppNameSpace } from '@/hooks/useAppNameSpace';

export type TaskCacheContext = {
  previousData?: ITask[];
};

export function readTaskSnapshot(ns: AppNameSpace): ITask[] | undefined {
  return ns.queryClient.getQueryData<ITask[]>(queryKey.tasks.list());
}
