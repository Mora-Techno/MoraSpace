import type { UserSession } from '@repo/types';

import { queryKey } from '@/configs';
import type { AppNameSpace } from '@/hooks/useAppNameSpace';

export type SessionCacheContext = {
  previousData?: UserSession[];
};

export function readSessionSnapshot(ns: AppNameSpace): UserSession[] | undefined {
  return ns.queryClient.getQueryData<UserSession[]>(queryKey.session.list());
}
