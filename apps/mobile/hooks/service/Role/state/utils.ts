import type { IRole } from '@repo/types';
import type { QueryClient } from '@tanstack/react-query';

import { queryKey } from '@/config/query-key';

export type RoleCacheContext = {
  previousData?: IRole[];
};

export function readRoleSnapshot(queryClient: QueryClient): IRole[] | undefined {
  return queryClient.getQueryData<IRole[]>(queryKey.roles.list());
}
