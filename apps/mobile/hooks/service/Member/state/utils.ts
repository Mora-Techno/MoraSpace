import type { Member } from '@repo/types';
import type { QueryClient } from '@tanstack/react-query';

import { queryKey } from '@/config/query-key';

export type MemberCacheContext = {
  previousData?: Member[];
};

export function readMemberSnapshot(queryClient: QueryClient): Member[] | undefined {
  return queryClient.getQueryData<Member[]>(queryKey.members.list());
}
