import type { PickApiID } from '@repo/types/api.types';
import type { CalendarEvent, PickCreateEvent, PickUpdateEvent } from '@repo/types/calendar.types';
import { useMutation } from '@tanstack/react-query';

import { useAppNameSpace } from '@/hooks/useAppNameSpace';
import Api from '@/services/api';
import type { TResponse } from '@/types/api/response';

import { type CalendarCacheContext, readEventSnapshot } from './utils';
import { calenderRootKey } from './utils';

export function useCreateEvent() {
  const ns = useAppNameSpace();
  return useMutation<TResponse<CalendarEvent>, Error, PickCreateEvent, CalendarCacheContext>({
    mutationFn: (payload) => Api.Calendar.CreateEvent(payload),
    onMutate: async () => {
      await ns.queryClient.cancelQueries({ queryKey: calenderRootKey });
      return { previousData: readEventSnapshot(ns) };
    },
    onSuccess: (res) => {
      ns.alert.toast({
        title: res.message,
        message: res.message,
        icon: 'success',
      });
    },
    onSettled: async () => {
      await ns.queryClient.invalidateQueries({
        queryKey: calenderRootKey,
      });
    },
    onError: (err, _variables, context) => {
      if (context?.previousData !== undefined) {
        ns.queryClient.setQueryData(calenderRootKey, context.previousData);
      }
      ns.alert.toast({
        title: err.message,
        message: err.message,
        icon: 'error',
      });
    },
  });
}

export function useDeleteEvent() {
  const ns = useAppNameSpace();

  return useMutation<TResponse<CalendarEvent>, Error, PickApiID, CalendarCacheContext>({
    mutationFn: (id) => Api.Calendar.DeleteEvent(id),
    onMutate: async () => {
      await ns.queryClient.cancelQueries({ queryKey: calenderRootKey });
      return { previousData: readEventSnapshot(ns) };
    },
    onSuccess: (res) => {
      ns.alert.toast({
        title: res.message,
        message: res.message,
        icon: 'success',
      });
    },
    onSettled: async () => {
      await ns.queryClient.invalidateQueries({
        queryKey: calenderRootKey,
      });
    },
    onError: (err, _variables, context) => {
      if (context?.previousData !== undefined) {
        ns.queryClient.setQueryData(calenderRootKey, context.previousData);
      }
      ns.alert.toast({
        title: err.message,
        message: err.message,
        icon: 'error',
      });
    },
  });
}

export function useUpdateEvent() {
  const ns = useAppNameSpace();

  return useMutation<
    TResponse<CalendarEvent>,
    Error,
    { id: PickApiID; payload: PickUpdateEvent },
    CalendarCacheContext
  >({
    mutationFn: ({ id, payload }) => Api.Calendar.UpdateEvent(id, payload),
    onMutate: async () => {
      await ns.queryClient.cancelQueries({ queryKey: calenderRootKey });
      return { previousData: readEventSnapshot(ns) };
    },
    onSuccess: (res) => {
      ns.alert.toast({
        title: res.message,
        message: res.message,
        icon: 'success',
      });
    },
    onSettled: async () => {
      await ns.queryClient.invalidateQueries({
        queryKey: calenderRootKey,
      });
    },
    onError: (err, _variables, context) => {
      if (context?.previousData !== undefined) {
        ns.queryClient.setQueryData(calenderRootKey, context.previousData);
      }
      ns.alert.toast({
        title: err.message,
        message: err.message,
        icon: 'error',
      });
    },
  });
}
