import { useQuery } from '@tanstack/react-query';

import { queryKey } from '@/config/query-key';
import Api from '@/service/props.service';

export function useOwnerOverview() {
  return useQuery({
    queryKey: queryKey.dashboard.owner(),
    queryFn: async () => {
      const res = await Api.Dashboard.GetOwnerOverview();
      return res.data;
    },
    staleTime: 60_000,
  });
}
