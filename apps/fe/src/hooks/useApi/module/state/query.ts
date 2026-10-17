import { MODULE_QUERY } from '@repo/config/query-stale';
import type { ModuleQuery } from '@repo/types/module.types';
import { useQuery } from '@tanstack/react-query';

import { queryKey } from '@/configs';
import Api from '@/services/api';

export function useModules(query?: ModuleQuery) {
  return useQuery({
    queryKey: queryKey.modules.list(query),
    queryFn: async () => {
      const res = await Api.Module.ListModules(query);
      return res.data;
    },
    staleTime: MODULE_QUERY,
  });
}

export function useModule(id: string) {
  return useQuery({
    queryKey: queryKey.modules.detail(id),
    queryFn: async () => {
      const res = await Api.Module.GetModule(id);
      return res.data;
    },
    staleTime: MODULE_QUERY,
    enabled: !!id,
  });
}
