import type { NotificationInAppQuery, NotificationLogQuery } from '@repo/types';
import { useQuery } from '@tanstack/react-query';

import { queryKey } from '@/config/query-key';
import Api from '@/service/props.service';

import { notificationLogsKey } from './utils';

export function useNotificationLogs(query?: NotificationLogQuery) {
  return useQuery({
    queryKey: notificationLogsKey(query),
    queryFn: async () => {
      const res = await Api.Notification.ListNotificationLogs(query);
      return res.data;
    },
  });
}

export function useListInAppNotifications(query?: NotificationInAppQuery) {
  return useQuery({
    queryKey: queryKey.notifications.list(query),
    queryFn: async () => {
      const res = await Api.Notification.ListInAppNotifications(query);
      return res.data;
    },
  });
}
