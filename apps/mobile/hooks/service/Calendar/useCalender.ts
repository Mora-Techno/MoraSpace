import { useCreateEvent, useDeleteEvent, useUpdateEvent } from './state/mutate';
import { useEvents } from './state/query';

export const useCalender = () => {
  return {
    mutate: {
      create: useCreateEvent,
      delete: useDeleteEvent,
      update: useUpdateEvent,
    },
    query: {
      getCalender: useEvents,
    },
  };
};
