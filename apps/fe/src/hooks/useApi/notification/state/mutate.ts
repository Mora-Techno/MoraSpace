import type { NotificationLog, PickSendNotification } from '@repo/types';
import type { TResponse } from '@repo/types/response.types';
import { useMutation } from '@tanstack/react-query';

import { useAppNameSpace } from '@/hooks/useAppNameSpace';
import Api from '@/services/api';

import { notificationsRootKey } from './utils';
import { type NotificationCacheContext, readNotificationLogsSnapshot } from './utils';

export function useSendNotification() {
  const ns = useAppNameSpace();

  return useMutation<
    TResponse<NotificationLog>,
    Error,
    PickSendNotification,
    NotificationCacheContext
  >({
    mutationFn: (payload) => Api.Notification.SendNotification(payload),
    onMutate: async () => {
      await ns.queryClient.cancelQueries({
        queryKey: notificationsRootKey,
      });
      return { previousData: readNotificationLogsSnapshot(ns) };
    },
    onSuccess: (res) => {
      ns.alert.toast({
        title: res.message,
        message: res.message,
        icon: 'success',
      });
    },
    onSettled: async () => {
      await ns.queryClient.invalidateQueries({
        queryKey: notificationsRootKey,
      });
    },
    onError: (err, _variables, context) => {
      if (context?.previousData !== undefined) {
        ns.queryClient.setQueryData(notificationsRootKey, context.previousData);
      }
      ns.alert.toast({
        title: err.message,
        message: err.message,
        icon: 'error',
      });
    },
  });
}
