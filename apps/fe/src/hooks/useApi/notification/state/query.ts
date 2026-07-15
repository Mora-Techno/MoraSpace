import type { NotificationLogQuery } from '@repo/types';
import { useQuery } from '@tanstack/react-query';

import Api from '@/services/api';

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
