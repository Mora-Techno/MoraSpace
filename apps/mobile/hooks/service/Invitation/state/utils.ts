import type { Invitation } from '@repo/types';
import type { QueryClient } from '@tanstack/react-query';

import { queryKey } from '@/config/query-key';

export type InvitationCacheContext = {
  previousData?: Invitation[];
};

export function readInvitationSnapshot(queryClient: QueryClient): Invitation[] | undefined {
  return queryClient.getQueryData<Invitation[]>(queryKey.invitations.list());
}
