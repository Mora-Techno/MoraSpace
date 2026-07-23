import type { ICompanyMember } from '@repo/types';
import type { QueryClient } from '@tanstack/react-query';

import { queryKey } from '@/config/query-key';

export type MemberCacheContext = {
  previousData?: ICompanyMember[];
};

export function readMemberSnapshot(queryClient: QueryClient): ICompanyMember[] | undefined {
  return queryClient.getQueryData<ICompanyMember[]>(queryKey.members.list());
}
