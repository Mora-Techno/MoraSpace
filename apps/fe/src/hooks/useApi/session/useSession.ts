import { useDeleteSessionAll, useDeleteSessionById } from './state/mutate';
import { useGetSession, useListSessions } from './state/query';

export const useSession = () => {
  return {
    mutate: {
      deleteById: useDeleteSessionById,
      deleteAll: useDeleteSessionAll,
    },
    query: {
      list: useListSessions,
      detail: useGetSession,
    },
  };
};
