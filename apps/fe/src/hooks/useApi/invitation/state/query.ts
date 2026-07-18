import { useQuery } from '@tanstack/react-query';

import { queryKey } from '@/configs';
import Api from '@/services/api';

export function useListInvitations() {
  return useQuery({
    queryKey: queryKey.invitations.list(),
    queryFn: async () => {
      const res = await Api.Invitation.ListInvitations();
      return res.data;
    },
  });
}
