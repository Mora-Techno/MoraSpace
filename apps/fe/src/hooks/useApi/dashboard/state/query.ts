import type { OwnerDashboardOverview } from '@repo/types';
import { useQuery } from '@tanstack/react-query';

import { queryKey } from '@/configs';
import Api from '@/services/api';

export function useOwnerOverview() {
  return useQuery<OwnerDashboardOverview>({
    queryKey: queryKey.dashboard.owner(),
    queryFn: async () => {
      const res = await Api.Dashboard.GetOwnerOverview();
      return res.data;
    },
    staleTime: 1000 * 60,
  });
}
