import type { IPosition } from '@repo/types';

import { queryKey } from '@/configs';
import type { AppNameSpace } from '@/hooks/useAppNameSpace';

export type PositionCacheContext = {
  previousData?: IPosition[];
};

export function readPositionSnapshot(ns: AppNameSpace): IPosition[] | undefined {
  return ns.queryClient.getQueryData<IPosition[]>(queryKey.positions.list());
}

export const positionsRoot = queryKey.positionsRoot();
