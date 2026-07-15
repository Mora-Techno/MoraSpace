import { useMutation } from '@tanstack/react-query';

import { queryKey } from '@/configs';
import { useAppNameSpace } from '@/hooks/useAppNameSpace';
import Api from '@/services/api';
import type { CreateCheckoutInput } from '@/types/api/subscription';

export function useCancelSubscription() {
  const ns = useAppNameSpace();

  return useMutation({
    mutationFn: () => Api.Subscription.CancelSubscription(),
    onSuccess: (res) => {
      ns.alert.toast({
        title: res.message,
        message: res.message,
        icon: 'success',
      });
    },
    onSettled: async () => {
      await ns.queryClient.invalidateQueries({
        queryKey: queryKey.subscriptionsRoot(),
      });
    },
    onError: (err: Error) => {
      ns.alert.toast({
        title: err.message,
        message: err.message,
        icon: 'error',
      });
    },
  });
}

export function useCreateCheckout() {
  const ns = useAppNameSpace();

  return useMutation({
    mutationFn: (payload: CreateCheckoutInput) => Api.Subscription.Checkout(payload),
    onSuccess: (res) => {
      ns.alert.toast({
        title: res.message,
        message: res.message,
        icon: 'success',
      });

      if (res.data.checkoutUrl) {
        window.location.href = res.data.checkoutUrl;
      } else {
        void ns.queryClient.invalidateQueries({
          queryKey: queryKey.subscriptionsRoot(),
        });
      }
    },
    onError: (err: Error) => {
      ns.alert.toast({
        title: err.message,
        message: err.message,
        icon: 'error',
      });
    },
  });
}
