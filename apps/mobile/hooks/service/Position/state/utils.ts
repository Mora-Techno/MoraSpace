import type { Position } from '@repo/types';
import type { QueryClient } from '@tanstack/react-query';

import { queryKey } from '@/config/query-key';

export type PositionCacheContext = {
  previousData?: Position[];
};

export function readPositionSnapshot(queryClient: QueryClient): Position[] | undefined {
  return queryClient.getQueryData<Position[]>(queryKey.positions.list());
}
