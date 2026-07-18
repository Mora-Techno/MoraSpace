import type { Invitation } from '@repo/types';

import { queryKey } from '@/configs';
import type { AppNameSpace } from '@/hooks/useAppNameSpace';

export type InvitationCacheContext = {
  previousData?: Invitation[];
};

export function readInvitationSnapshot(ns: AppNameSpace): Invitation[] | undefined {
  return ns.queryClient.getQueryData<Invitation[]>(queryKey.invitations.list());
}
