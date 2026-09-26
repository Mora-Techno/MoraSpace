import { queryKey } from "@/configs";
import { useAppMutation } from "@/hooks/useAppMutation";
import Api from "@/services/api";
import type { CreateCheckoutInput } from "@/types/api/subscription";

export function useCancelSubscription() {
  return useAppMutation<unknown, void>({
    mutationFn: () => Api.Subscription.CancelSubscription(),
    invalidateKeys: [queryKey.subscriptionsRoot()],
  });
}

export function useCreateCheckout() {
  return useAppMutation<{ checkoutUrl?: string | null }, CreateCheckoutInput>({
    mutationFn: (payload: CreateCheckoutInput) =>
      Api.Subscription.Checkout(payload),
    invalidateKeys: [queryKey.subscriptionsRoot()],
    onSuccess: (res) => {
      if (res.data?.checkoutUrl) {
        window.location.href = res.data.checkoutUrl;
      }
    },
  });
}
