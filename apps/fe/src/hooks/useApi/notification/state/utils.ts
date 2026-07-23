import type { NotificationLog } from '@repo/types';
import type { NotificationLogQuery } from '@repo/types';

import { queryKey } from '@/configs';
import type { AppNameSpace } from '@/hooks/useAppNameSpace';

export type NotificationCacheContext = {
  previousData?: NotificationLog[];
};

export const notificationLogsKey = (query?: NotificationLogQuery) =>
  queryKey.notifications.logs(query);

export function readNotificationLogsSnapshot(
  ns: AppNameSpace,
  query?: NotificationLogQuery,
): NotificationLog[] | undefined {
  return ns.queryClient.getQueryData<NotificationLog[]>(notificationLogsKey(query));
}
export const notificationsRootKey = queryKey.notificationsRoot();
