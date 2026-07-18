import type { Member } from '@repo/types';

import { queryKey } from '@/configs';
import type { AppNameSpace } from '@/hooks/useAppNameSpace';

export type MemberCacheContext = {
  previousData?: Member[];
};

export function readMemberSnapshot(ns: AppNameSpace): Member[] | undefined {
  return ns.queryClient.getQueryData<Member[]>(queryKey.members.list());
}
