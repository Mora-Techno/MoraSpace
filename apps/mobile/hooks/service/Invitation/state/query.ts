import { useQuery } from '@tanstack/react-query';

import { queryKey } from '@/config/query-key';
import Api from '@/service/props.service';

export function useListInvitations() {
  return useQuery({
    queryKey: queryKey.invitations.list(),
    queryFn: async () => {
      const res = await Api.Invitation.ListInvitations();
      return res.data;
    },
  });
}
