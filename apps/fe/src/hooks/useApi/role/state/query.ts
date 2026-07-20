import { MODULE_QUERY } from '@repo/config/query-stale';
import { useQuery } from '@tanstack/react-query';

import { queryKey } from '@/configs';
import Api from '@/services/api';

export function useListRoles() {
  return useQuery({
    queryKey: queryKey.roles.list(),
    queryFn: async () => {
      const res = await Api.Role.ListRoles();
      return res.data;
    },
    staleTime: MODULE_QUERY,
  });
}

export function useGetRolePermissions(id: string) {
  return useQuery({
    queryKey: queryKey.roles.permissions(id),
    queryFn: async () => {
      const res = await Api.Role.GetRolePermissions(id);
      return res.data;
    },
    staleTime: MODULE_QUERY,
    enabled: !!id,
  });
}

export function useListMasterPermissions() {
  return useQuery({
    queryKey: queryKey.roles.masterPermissions(),
    queryFn: async () => {
      const res = await Api.Role.ListMasterPermissions();
      return res.data;
    },
    staleTime: MODULE_QUERY,
  });
}
