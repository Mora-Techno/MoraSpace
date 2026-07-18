import type { Position } from '@repo/types';

import { queryKey } from '@/configs';
import type { AppNameSpace } from '@/hooks/useAppNameSpace';

export type PositionCacheContext = {
  previousData?: Position[];
};

export function readPositionSnapshot(ns: AppNameSpace): Position[] | undefined {
  return ns.queryClient.getQueryData<Position[]>(queryKey.positions.list());
}
