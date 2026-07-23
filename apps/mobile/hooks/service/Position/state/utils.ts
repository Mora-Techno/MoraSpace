import type { IPosition } from '@repo/types';
import type { QueryClient } from '@tanstack/react-query';

import { queryKey } from '@/config/query-key';

export type PositionCacheContext = {
  previousData?: IPosition[];
};

export function readPositionSnapshot(queryClient: QueryClient): IPosition[] | undefined {
  return queryClient.getQueryData<IPosition[]>(queryKey.positions.list());
}
