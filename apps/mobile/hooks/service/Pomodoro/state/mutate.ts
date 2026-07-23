import type { IPomodoroSession, PickStartPomodoro, PickStopPomodoro, TResponse } from '@repo/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Alert } from 'react-native';

import { queryKey } from '@/config/query-key';
import Api from '@/service/props.service';

import { PomodoroCacheContext, readPomodoroSnapshot } from './utils';

export function useStartPomodoroSession() {
  const queryClient = useQueryClient();
  return useMutation<
    TResponse<IPomodoroSession>,
    Error,
    PickStartPomodoro | undefined,
    PomodoroCacheContext
  >({
    mutationFn: (payload) => Api.Pomodoro.StartSession(payload),
    onSuccess: (res) => {
      Alert.alert('Sukses', res.message);
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: queryKey.pomodoroRoot() });
      return { previousData: readPomodoroSnapshot(queryClient) };
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKey.pomodoroRoot() });
    },
    onError: (err) => {
      Alert.alert('Error', err.message);
    },
  });
}

export function usePausePomodoroSession() {
  const queryClient = useQueryClient();
  return useMutation<TResponse<IPomodoroSession>, Error, void, PomodoroCacheContext>({
    mutationFn: () => Api.Pomodoro.PauseSession(),
    onSuccess: (res) => {
      Alert.alert('Sukses', res.message);
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: queryKey.pomodoroRoot() });
      return { previousData: readPomodoroSnapshot(queryClient) };
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKey.pomodoroRoot() });
    },
    onError: (err) => {
      Alert.alert('Error', err.message);
    },
  });
}

export function useResumePomodoroSession() {
  const queryClient = useQueryClient();
  return useMutation<TResponse<IPomodoroSession>, Error, void, PomodoroCacheContext>({
    mutationFn: () => Api.Pomodoro.ResumeSession(),
    onSuccess: (res) => {
      Alert.alert('Sukses', res.message);
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: queryKey.pomodoroRoot() });
      return { previousData: readPomodoroSnapshot(queryClient) };
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKey.pomodoroRoot() });
    },
    onError: (err) => {
      Alert.alert('Error', err.message);
    },
  });
}

export function useStopPomodoroSession() {
  const queryClient = useQueryClient();
  return useMutation<
    TResponse<IPomodoroSession>,
    Error,
    PickStopPomodoro | undefined,
    PomodoroCacheContext
  >({
    mutationFn: (payload) => Api.Pomodoro.StopSession(payload),
    onSuccess: (res) => {
      Alert.alert('Sukses', res.message);
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: queryKey.pomodoroRoot() });
      return { previousData: readPomodoroSnapshot(queryClient) };
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKey.pomodoroRoot() });
    },
    onError: (err) => {
      Alert.alert('Error', err.message);
    },
  });
}
