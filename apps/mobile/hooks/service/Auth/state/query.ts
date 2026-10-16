import { useQuery } from '@tanstack/react-query';

import { queryKey } from '@/config/query-key';
import Api from '@/service/props.service';

export function useWorkspaces() {
  return useQuery({
    queryKey: queryKey.auth.workspaces(),
    queryFn: async () => {
      const res = await Api.Auth.ListWorkspaces();
      return res.data;
    },
    staleTime: 60_000,
  });
}
