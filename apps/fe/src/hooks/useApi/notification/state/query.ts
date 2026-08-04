import { MODULE_QUERY } from "@repo/config/query-stale";
import type { NotificationInAppQuery, NotificationLogQuery } from "@repo/types";
import { useQuery } from "@tanstack/react-query";

import Api from "@/services/api";

import {
  notificationDetailKey,
  notificationLogsKey,
  notificationsListKey,
} from "./utils";

export function useNotificationLogs(query?: NotificationLogQuery) {
  return useQuery({
    queryKey: notificationLogsKey(query),
    queryFn: async () => {
      const res = await Api.Notification.ListNotificationLogs(query);
      return res.data;
    },
    staleTime: MODULE_QUERY,
  });
}

export function useNotifications(query?: NotificationInAppQuery) {
  return useQuery({
    queryKey: notificationsListKey(query),
    queryFn: async () => {
      const res = await Api.Notification.ListInAppNotifications(query);
      return res.data;
    },
    staleTime: MODULE_QUERY,
  });
}

export function useNotification(id: string) {
  return useQuery({
    queryKey: notificationDetailKey(id),
    queryFn: async () => {
      const res = await Api.Notification.GetNotification(id);
      return res.data;
    },
    staleTime: MODULE_QUERY,
    enabled: !!id,
  });
}
