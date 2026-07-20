import { IInvitation } from '@repo/types';

import { queryKey } from '@/configs';
import type { AppNameSpace } from '@/hooks/useAppNameSpace';

export type InvitationCacheContext = {
  previousData?: IInvitation[];
};

export function readInvitationSnapshot(ns: AppNameSpace): IInvitation[] | undefined {
  return ns.queryClient.getQueryData<IInvitation[]>(queryKey.invitations.list());
}
export const invitationsRootKey = queryKey.invitationsRoot();
