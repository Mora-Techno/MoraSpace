import { useSendNotification } from './state/mutate';
import { useNotificationLogs } from './state/query';

export const useNotification = () => {
  return {
    mutate: {
      send: useSendNotification,
    },
    query: {
      getLog: useNotificationLogs,
    },
  };
};
