import type { UserWorkspacesResponse } from '@repo/types';
import { useQuery } from '@tanstack/react-query';

import { queryKey } from '@/configs';
import Api from '@/services/api';

export function useWorkspaces() {
  return useQuery<UserWorkspacesResponse>({
    queryKey: queryKey.auth.workspaces(),
    queryFn: async () => {
      const res = await Api.Auth.ListWorkspaces();
      return res.data;
    },
    staleTime: 1000 * 60 * 2,
  });
}
