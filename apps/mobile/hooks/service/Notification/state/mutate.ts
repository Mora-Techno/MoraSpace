import type { NotificationLog, PickSendNotification } from '@repo/types';
import type { TResponse } from '@repo/types/response.types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Alert } from 'react-native';

import Api from '@/service/props.service';
import {
  type NotificationCacheContext,
  notificationsRootKey,
  readNotificationLogsSnapshot,
} from './utils';

export function useSendNotification() {
  const queryClient = useQueryClient();

  return useMutation<
    TResponse<NotificationLog>,
    Error,
    PickSendNotification,
    NotificationCacheContext
  >({
    mutationFn: (payload) => Api.Notification.SendNotification(payload),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: notificationsRootKey });
      return { previousData: readNotificationLogsSnapshot(queryClient) };
    },
    onSuccess: (res) => {
      Alert.alert('Sukses', res.message);
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: notificationsRootKey });
    },
    onError: (err, _variables, context) => {
      if (context?.previousData !== undefined) {
        queryClient.setQueryData(notificationsRootKey, context.previousData);
      }
      Alert.alert('Error', err.message);
    },
  });
}
