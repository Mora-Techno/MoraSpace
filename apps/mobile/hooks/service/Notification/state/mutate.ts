import type { NotificationLog, PickSendNotification } from "@repo/types";
import { useAppMutation } from "@/hooks/useAppMutation";
import Api from "@/service/props.service";
import {
  type NotificationCacheContext,
  notificationsRootKey,
  readNotificationLogsSnapshot,
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
        title: "Error",
        message: err.message,
        icon: "error",
      });
    },
  });
}
