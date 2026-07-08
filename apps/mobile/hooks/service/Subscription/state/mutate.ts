import type { PickCreateCheckout } from '@repo/types/subscription.types';
import type { TResponse } from '@repo/types/response.types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Alert } from 'react-native';
import { queryKey } from '@/config/query-key';
import * as Linking from 'expo-linking';

import Api from '@/service/props.service';

export function useCancelSubscription() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => Api.Subscription.CancelSubscription(),
    onSuccess: (res) => {
      Alert.alert('Sukses', res.message);
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({
        queryKey: queryKey.subscriptionsRoot(),
      });
    },
    onError: (err: Error) => {
      Alert.alert('Error', err.message);
    },
  });
}

export function useCreateCheckout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: PickCreateCheckout) => Api.Subscription.Checkout(payload),
    onSuccess: (res) => {
      Alert.alert('Sukses', res.message);

      if (res.data.checkoutUrl) {
        Linking.openURL(res.data.checkoutUrl);
      } else {
        void queryClient.invalidateQueries({
          queryKey: queryKey.subscriptionsRoot(),
        });
      }
    },
    onError: (err: Error) => {
      Alert.alert('Error', err.message);
    },
  });
}
