import {
  useMarkAllNotificationsRead,
  useMarkNotificationRead,
  useSendNotification,
} from './state/mutate';
import { useListInAppNotifications, useNotificationLogs } from './state/query';

export const useNotification = () => {
  return {
    mutate: {
      send: useSendNotification,
      markRead: useMarkNotificationRead,
      markAllRead: useMarkAllNotificationsRead,
    },
    query: {
      list: useListInAppNotifications,
      getLog: useNotificationLogs,
    },
  };
};
