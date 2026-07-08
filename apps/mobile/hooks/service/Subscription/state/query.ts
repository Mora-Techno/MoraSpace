import { useQuery } from '@tanstack/react-query';
import { queryKey } from '@/config/query-key';

import Api from '@/service/props.service';

export function useSubscription() {
  return useQuery({
    queryKey: queryKey.subscriptions.me(),
    queryFn: async () => {
      const res = await Api.Subscription.GetMySubscription();
      return res.data;
    },
  });
}

export function useSubscriptionPlans() {
  return useQuery({
    queryKey: queryKey.subscriptions.plans(),
    queryFn: async () => {
      const res = await Api.Subscription.ListPlans();
      return res.data;
    },
    staleTime: 1000 * 60 * 10,
  });
}
