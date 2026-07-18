import type { UserSession } from '@repo/types';
import type { QueryClient } from '@tanstack/react-query';

import { queryKey } from '@/config/query-key';

export type SessionCacheContext = {
  previousData?: UserSession[];
};

export function readSessionSnapshot(queryClient: QueryClient): UserSession[] | undefined {
  return queryClient.getQueryData<UserSession[]>(queryKey.session.list());
}
