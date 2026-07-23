import type { Session } from '@repo/types';

import { queryKey } from '@/configs';
import type { AppNameSpace } from '@/hooks/useAppNameSpace';

export type SessionCacheContext = {
  previousData?: Session[];
};

export function readSessionSnapshot(ns: AppNameSpace): Session[] | undefined {
  return ns.queryClient.getQueryData<Session[]>(queryKey.session.list());
}
