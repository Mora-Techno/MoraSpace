import type { IInvitation } from '@repo/types';
import type { QueryClient } from '@tanstack/react-query';

import { queryKey } from '@/config/query-key';

export type InvitationCacheContext = {
  previousData?: IInvitation[];
};

export function readInvitationSnapshot(queryClient: QueryClient): IInvitation[] | undefined {
  return queryClient.getQueryData<IInvitation[]>(queryKey.invitations.list());
}
