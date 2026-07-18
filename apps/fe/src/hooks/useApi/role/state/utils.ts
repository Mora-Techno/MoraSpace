import type { Role } from '@repo/types';

import { queryKey } from '@/configs';
import type { AppNameSpace } from '@/hooks/useAppNameSpace';

export type RoleCacheContext = {
  previousData?: Role[];
};

export function readRoleSnapshot(ns: AppNameSpace): Role[] | undefined {
  return ns.queryClient.getQueryData<Role[]>(queryKey.roles.list());
}
