import {
  useMarkAllRead,
  useMarkRead,
  useSendNotification,
} from "./state/mutate";
import {
  useNotification as useNotificationQuery,
  useNotificationLogs,
  useNotifications,
} from "./state/query";

export const useNotification = () => {
  return {
    mutate: {
      send: useSendNotification,
      markRead: useMarkRead,
      markAllRead: useMarkAllRead,
    },
    query: {
      getLog: useNotificationLogs,
      get: useNotifications,
      getByID: useNotificationQuery,
    },
  };
};
