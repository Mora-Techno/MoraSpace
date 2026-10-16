import type {
  MemberWorkingStatus,
  OwnerMetricsSummary,
  UrgentQuotaStatus,
  WorkingHoursStatusQuery,
} from '@repo/types';
import { useQuery } from '@tanstack/react-query';

import { queryKey } from '@/configs';
import { hasCompanyChatContext } from '@/hooks/useChatSocket';
import Api from '@/services/api';
import { loadAuthSession } from '@/utils/storage';

function hasCompany(): boolean {
  if (typeof window === 'undefined') return false;
  const token = loadAuthSession()?.accessToken ?? null;
  return hasCompanyChatContext(token);
}

export function useMemberStatus(memberId?: string) {
  const isEnabled = hasCompany();
  return useQuery<MemberWorkingStatus | MemberWorkingStatus[]>({
    queryKey: queryKey.workingHours.status(memberId),
    queryFn: async () => {
      const query: WorkingHoursStatusQuery = memberId ? { memberId } : {};
      const res = await Api.WorkingHours.GetStatus(query);
      return res.data;
    },
    enabled: isEnabled,
    staleTime: 1000 * 60, // Caching 60s
    refetchInterval: 1000 * 60, // Refresh status every minute
  });
}

export function useUrgentQuota() {
  const isEnabled = hasCompany();
  return useQuery<UrgentQuotaStatus>({
    queryKey: queryKey.workingHours.quota(),
    queryFn: async () => {
      const res = await Api.WorkingHours.GetQuota();
      return res.data;
    },
    enabled: isEnabled,
    staleTime: 1000 * 30,
  });
}

export function useOwnerMetrics(range: '7d' | '30d' = '7d') {
  const isEnabled = hasCompany();
  return useQuery<OwnerMetricsSummary>({
    queryKey: queryKey.workingHours.metrics(range),
    queryFn: async () => {
      const res = await Api.WorkingHours.GetMetrics({ range });
      return res.data;
    },
    enabled: isEnabled,
    staleTime: 1000 * 60 * 5,
  });
}
