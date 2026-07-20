import type { ICompanyMember } from '@repo/types';

import { queryKey } from '@/configs';
import type { AppNameSpace } from '@/hooks/useAppNameSpace';

export type MemberCacheContext = {
  previousData?: ICompanyMember[];
};

export function readMemberSnapshot(ns: AppNameSpace): ICompanyMember[] | undefined {
  return ns.queryClient.getQueryData<ICompanyMember[]>(queryKey.members.list());
}
export const membersRoot = queryKey.membersRoot();
