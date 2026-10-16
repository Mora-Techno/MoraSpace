import type {
  MemberWorkingStatus,
  OwnerMetricsSummary,
  UrgentQuotaStatus,
  WorkingHoursStatusQuery,
} from '@repo/types';
import { useQuery } from '@tanstack/react-query';

import { queryKey } from '@/config/query-key';
import Api from '@/service/props.service';

export function useMemberStatus(memberId?: string) {
  return useQuery<MemberWorkingStatus | MemberWorkingStatus[]>({
    queryKey: queryKey.workingHours.status(memberId),
    queryFn: async () => {
      const query: WorkingHoursStatusQuery = memberId ? { memberId } : {};
      const res = await Api.WorkingHours.GetStatus(query);
      return res.data;
    },
    staleTime: 1000 * 60,
    refetchInterval: 1000 * 60,
  });
}

export function useUrgentQuota() {
  return useQuery<UrgentQuotaStatus>({
    queryKey: queryKey.workingHours.quota(),
    queryFn: async () => {
      const res = await Api.WorkingHours.GetQuota();
      return res.data;
    },
    staleTime: 1000 * 30,
  });
}

export function useOwnerMetrics(range: '7d' | '30d' = '7d') {
  return useQuery<OwnerMetricsSummary>({
    queryKey: queryKey.workingHours.metrics(range),
    queryFn: async () => {
      const res = await Api.WorkingHours.GetMetrics({ range });
      return res.data;
    },
    staleTime: 1000 * 60 * 5,
  });
}
