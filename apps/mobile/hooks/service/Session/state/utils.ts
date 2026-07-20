import type { Session } from '@repo/types';
import type { QueryClient } from '@tanstack/react-query';

import { queryKey } from '@/config/query-key';

export type SessionCacheContext = {
  previousData?: Session[];
};

export function readSessionSnapshot(queryClient: QueryClient): Session[] | undefined {
  return queryClient.getQueryData<Session[]>(queryKey.session.list());
}
