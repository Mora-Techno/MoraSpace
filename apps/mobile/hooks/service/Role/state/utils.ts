import type { Role } from '@repo/types';
import type { QueryClient } from '@tanstack/react-query';

import { queryKey } from '@/config/query-key';

export type RoleCacheContext = {
  previousData?: Role[];
};

export function readRoleSnapshot(queryClient: QueryClient): Role[] | undefined {
  return queryClient.getQueryData<Role[]>(queryKey.roles.list());
}
