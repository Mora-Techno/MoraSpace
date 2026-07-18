import { useQuery } from "@tanstack/react-query";

import { queryKey } from "@/configs";
import Api from "@/services/api";
import { MODULE_QUERY } from "@repo/config/query-stale";

export function useSubscription() {
  return useQuery({
    queryKey: queryKey.subscriptions.me(),
    queryFn: async () => {
      const res = await Api.Subscription.GetMySubscription();
      return res.data;
    },
    staleTime: MODULE_QUERY,
  });
}

export function useSubscriptionPlans() {
  return useQuery({
    queryKey: queryKey.subscriptions.plans(),
    queryFn: async () => {
      const res = await Api.Subscription.ListPlans();
      return res.data;
    },
    staleTime: MODULE_QUERY,
  });
}
