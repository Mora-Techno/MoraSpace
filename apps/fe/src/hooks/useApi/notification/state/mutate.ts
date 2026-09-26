import type {
  NotificationInApp,
  NotificationLog,
  PickSendNotification,
} from "@repo/types";

import { useAppMutation } from "@/hooks/useAppMutation";
import Api from "@/services/api";

import {
  type NotificationCacheContext,
  type NotificationListCacheContext,
  notificationsRootKey,
  readNotificationLogsSnapshot,
  readNotificationsSnapshot,
} from "./utils";

export function useSendNotification() {
  return useAppMutation<
    NotificationLog,
    PickSendNotification,
    NotificationCacheContext
  >({
    mutationFn: (payload) => Api.Notification.SendNotification(payload),
    invalidateKeys: [notificationsRootKey],
    optimistic: (ns) => ({ previousData: readNotificationLogsSnapshot(ns) }),
    onError: (err, _vars, context, ns) => {
      if (context?.previousData !== undefined) {
        ns.queryClient.setQueryData(notificationsRootKey, context.previousData);
      }
      ns.alert.toast({
        title: err.message,
        message: err.message,
        icon: "error",
      });
    },
  });
}

export function useMarkRead() {
  return useAppMutation<
    NotificationInApp,
    string,
    NotificationListCacheContext
  >({
    mutationFn: (id) => Api.Notification.MarkRead(id),
    invalidateKeys: [notificationsRootKey],
    optimistic: (ns) => ({ previousData: readNotificationsSnapshot(ns) }),
    onError: (err, _vars, context, ns) => {
      if (context?.previousData !== undefined) {
        ns.queryClient.setQueryData(notificationsRootKey, context.previousData);
      }
      ns.alert.toast({
        title: err.message,
        message: err.message,
        icon: "error",
      });
    },
  });
}

export function useMarkAllRead() {
  return useAppMutation<
    unknown,
    void,
    NotificationListCacheContext
  >({
    mutationFn: () => Api.Notification.MarkAllRead(),
    invalidateKeys: [notificationsRootKey],
    optimistic: (ns) => ({ previousData: readNotificationsSnapshot(ns) }),
    onError: (err, _vars, context, ns) => {
      if (context?.previousData !== undefined) {
        ns.queryClient.setQueryData(notificationsRootKey, context.previousData);
      }
      ns.alert.toast({
        title: err.message,
        message: err.message,
        icon: "error",
      });
    },
  });
}
