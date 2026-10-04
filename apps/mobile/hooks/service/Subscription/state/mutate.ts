import type { PickCreateCheckout } from '@repo/types/subscription.types';
import * as Linking from 'expo-linking';
import { queryKey } from '@/config/query-key';
import { useAppMutation } from '@/hooks/useAppMutation';
import Api from '@/service/props.service';

export function useCancelSubscription() {
  return useAppMutation<unknown, void>({
    mutationFn: () => Api.Subscription.CancelSubscription(),
    invalidateKeys: [queryKey.subscriptionsRoot()],
  });
}

export function useCreateCheckout() {
  return useAppMutation<{ checkoutUrl?: string | null }, PickCreateCheckout>({
    mutationFn: (payload: PickCreateCheckout) => Api.Subscription.Checkout(payload),
    invalidateKeys: [queryKey.subscriptionsRoot()],
    onSuccess: async (res, _vars, _ctx, ns) => {
      const url = res.data?.checkoutUrl;
      if (!url) return;
      try {
        const can = await Linking.canOpenURL(url);
        if (can) {
          await Linking.openURL(url);
        } else {
          ns?.alert?.toast?.({
            title: 'Gagal membuka checkout',
            message: 'Link checkout tidak dapat dibuka di perangkat ini',
            icon: 'error',
          });
        }
      } catch {
        ns?.alert?.toast?.({
          title: 'Gagal membuka checkout',
          message: 'Terjadi kesalahan saat membuka link checkout',
          icon: 'error',
        });
      }
    },
  });
}
