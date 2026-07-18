import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Alert } from 'react-native';

import { queryKey } from '@/config/query-key';
import Api from '@/service/props.service';

export function useStartPomodoroSession() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload?: any) => Api.Pomodoro.StartSession(payload),
    onSuccess: (res: any) => {
      Alert.alert('Sukses', res.message);
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKey.pomodoroRoot() });
    },
    onError: (err: any) => {
      Alert.alert('Error', err.message);
    },
  });
}

export function usePausePomodoroSession() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => Api.Pomodoro.PauseSession(),
    onSuccess: (res: any) => {
      Alert.alert('Sukses', res.message);
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKey.pomodoroRoot() });
    },
    onError: (err: any) => {
      Alert.alert('Error', err.message);
    },
  });
}

export function useResumePomodoroSession() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => Api.Pomodoro.ResumeSession(),
    onSuccess: (res: any) => {
      Alert.alert('Sukses', res.message);
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKey.pomodoroRoot() });
    },
    onError: (err: any) => {
      Alert.alert('Error', err.message);
    },
  });
}

export function useStopPomodoroSession() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload?: any) => Api.Pomodoro.StopSession(payload),
    onSuccess: (res: any) => {
      Alert.alert('Sukses', res.message);
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKey.pomodoroRoot() });
    },
    onError: (err: any) => {
      Alert.alert('Error', err.message);
    },
  });
}
