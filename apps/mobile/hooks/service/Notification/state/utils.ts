import type { NotificationLog, NotificationLogQuery } from '@repo/types';
import type { QueryClient } from '@tanstack/react-query';

import { queryKey } from '@/config/query-key';

export type NotificationCacheContext = {
  previousData?: NotificationLog[];
};

export const notificationLogsKey = (query?: NotificationLogQuery) =>
  queryKey.notifications.logs(query);

export function readNotificationLogsSnapshot(
  queryClient: QueryClient,
  query?: NotificationLogQuery,
): NotificationLog[] | undefined {
  return queryClient.getQueryData<NotificationLog[]>(notificationLogsKey(query));
}

export const notificationsRootKey = queryKey.notificationsRoot();
