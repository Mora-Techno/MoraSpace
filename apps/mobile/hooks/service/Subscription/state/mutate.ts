import type { PickCreateCheckout } from "@repo/types/subscription.types";
import * as Linking from "expo-linking";
import { queryKey } from "@/config/query-key";
import { useAppMutation } from "@/hooks/useAppMutation";
import Api from "@/service/props.service";

export function useCancelSubscription() {
  return useAppMutation<unknown, void>({
    mutationFn: () => Api.Subscription.CancelSubscription(),
    invalidateKeys: [queryKey.subscriptionsRoot()],
  });
}

export function useCreateCheckout() {
  return useAppMutation<{ checkoutUrl?: string | null }, PickCreateCheckout>({
    mutationFn: (payload: PickCreateCheckout) =>
      Api.Subscription.Checkout(payload),
    invalidateKeys: [queryKey.subscriptionsRoot()],
    onSuccess: (res) => {
      if (res.data?.checkoutUrl) {
        Linking.openURL(res.data.checkoutUrl);
      }
    },
  });
}
