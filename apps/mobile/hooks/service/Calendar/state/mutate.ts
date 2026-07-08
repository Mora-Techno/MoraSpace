import type { CalendarEvent, PickCreateEvent, PickUpdateEvent } from '@repo/types/calendar.types';
import type { PickApiID } from '@repo/types/api.types';
import type { TResponse } from '@repo/types/response.types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Alert } from 'react-native';

import Api from '@/service/props.service';
import { type CalendarCacheContext, calenderRootKey, readEventSnapshot } from './utils';

export function useCreateEvent() {
  const queryClient = useQueryClient();

  return useMutation<TResponse<CalendarEvent>, Error, PickCreateEvent, CalendarCacheContext>({
    mutationFn: (payload) => Api.Calendar.CreateEvent(payload),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: calenderRootKey });
      return { previousData: readEventSnapshot(queryClient) };
    },
    onSuccess: (res) => {
      Alert.alert('Sukses', res.message);
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: calenderRootKey });
    },
    onError: (err, _variables, context) => {
      if (context?.previousData !== undefined) {
        queryClient.setQueryData(calenderRootKey, context.previousData);
      }
      Alert.alert('Error', err.message);
    },
  });
}

export function useDeleteEvent() {
  const queryClient = useQueryClient();

  return useMutation<TResponse<CalendarEvent>, Error, PickApiID, CalendarCacheContext>({
    mutationFn: (id) => Api.Calendar.DeleteEvent(id),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: calenderRootKey });
      return { previousData: readEventSnapshot(queryClient) };
    },
    onSuccess: (res) => {
      Alert.alert('Sukses', res.message);
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: calenderRootKey });
    },
    onError: (err, _variables, context) => {
      if (context?.previousData !== undefined) {
        queryClient.setQueryData(calenderRootKey, context.previousData);
      }
      Alert.alert('Error', err.message);
    },
  });
}

export function useUpdateEvent() {
  const queryClient = useQueryClient();

  return useMutation<
    TResponse<CalendarEvent>,
    Error,
    { id: PickApiID; payload: PickUpdateEvent },
    CalendarCacheContext
  >({
    mutationFn: ({ id, payload }) => Api.Calendar.UpdateEvent(id, payload),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: calenderRootKey });
      return { previousData: readEventSnapshot(queryClient) };
    },
    onSuccess: (res) => {
      Alert.alert('Sukses', res.message);
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: calenderRootKey });
    },
    onError: (err, _variables, context) => {
      if (context?.previousData !== undefined) {
        queryClient.setQueryData(calenderRootKey, context.previousData);
      }
      Alert.alert('Error', err.message);
    },
  });
}
