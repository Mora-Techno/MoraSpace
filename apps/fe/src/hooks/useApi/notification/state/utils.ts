import type {
  NotificationInApp,
  NotificationInAppQuery,
  NotificationLog,
  NotificationLogQuery,
} from "@repo/types";

import { queryKey } from "@/configs";
import type { AppNameSpace } from "@/hooks/useAppNameSpace";

export type NotificationCacheContext = {
  previousData?: NotificationLog[];
};

export type NotificationListCacheContext = {
  previousData?: NotificationInApp[];
};

export const notificationLogsKey = (query?: NotificationLogQuery) =>
  queryKey.notifications.logs(query);

export const notificationsListKey = (query?: NotificationInAppQuery) =>
  queryKey.notifications.list(query);

export const notificationDetailKey = (id: string) =>
  queryKey.notifications.detail(id);

export function readNotificationLogsSnapshot(
  ns: AppNameSpace,
  query?: NotificationLogQuery,
): NotificationLog[] | undefined {
  return ns.queryClient.getQueryData<NotificationLog[]>(
    notificationLogsKey(query),
  );
}

export function readNotificationsSnapshot(
  ns: AppNameSpace,
  query?: NotificationInAppQuery,
): NotificationInApp[] | undefined {
  return ns.queryClient.getQueryData<NotificationInApp[]>(
    notificationsListKey(query),
  );
}

export const notificationsRootKey = queryKey.notificationsRoot();
