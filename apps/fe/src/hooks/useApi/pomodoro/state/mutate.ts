import { IPomodoroSession, PickStartPomodoro, PickStopPomodoro, TResponse } from '@repo/types';
import { useMutation } from '@tanstack/react-query';

import { queryKey } from '@/configs';
import { useAppNameSpace } from '@/hooks/useAppNameSpace';
import Api from '@/services/api';

import { podomoroRoot, PomodoroCacheContext, readPomodoroSnapshot } from './utils';

export function useStartPomodoroSession() {
  const ns = useAppNameSpace();
  return useMutation<TResponse<IPomodoroSession>, Error, PickStartPomodoro, PomodoroCacheContext>({
    mutationFn: (payload?) => Api.Pomodoro.StartSession(payload),
    onSuccess: (res) => {
      ns.alert.toast({
        title: res.message,
        message: res.message,
        icon: 'success',
      });
    },
    onMutate: async () => {
      await ns.queryClient.cancelQueries({ queryKey: podomoroRoot });
      return { previousData: readPomodoroSnapshot(ns) };
    },
    onSettled: async () => {
      await ns.queryClient.invalidateQueries({
        queryKey: podomoroRoot,
      });
    },
    onError: (err) => {
      ns.alert.toast({
        title: err.message,
        message: err.message,
        icon: 'error',
      });
    },
  });
}

export function usePausePomodoroSession() {
  const ns = useAppNameSpace();
  return useMutation<TResponse<IPomodoroSession>, Error, void, PomodoroCacheContext>({
    mutationFn: () => Api.Pomodoro.PauseSession(),
    onSuccess: (res) => {
      ns.alert.toast({
        title: res.message,
        message: res.message,
        icon: 'success',
      });
    },
    onMutate: async () => {
      await ns.queryClient.cancelQueries({ queryKey: podomoroRoot });
      return { previousData: readPomodoroSnapshot(ns) };
    },
    onSettled: async () => {
      await ns.queryClient.invalidateQueries({
        queryKey: podomoroRoot,
      });
    },
    onError: (err) => {
      ns.alert.toast({
        title: err.message,
        message: err.message,
        icon: 'error',
      });
    },
  });
}

export function useResumePomodoroSession() {
  const ns = useAppNameSpace();
  return useMutation<TResponse<IPomodoroSession>, Error, void, PomodoroCacheContext>({
    mutationFn: () => Api.Pomodoro.ResumeSession(),
    onSuccess: (res) => {
      ns.alert.toast({
        title: res.message,
        message: res.message,
        icon: 'success',
      });
    },
    onMutate: async () => {
      await ns.queryClient.cancelQueries({
        queryKey: podomoroRoot,
      });
      return { previousData: readPomodoroSnapshot(ns) };
    },
    onSettled: async () => {
      await ns.queryClient.invalidateQueries({
        queryKey: podomoroRoot,
      });
    },
    onError: (err) => {
      ns.alert.toast({
        title: err.message,
        message: err.message,
        icon: 'error',
      });
    },
  });
}

export function useStopPomodoroSession() {
  const ns = useAppNameSpace();
  return useMutation<TResponse<IPomodoroSession>, Error, PickStopPomodoro, PomodoroCacheContext>({
    mutationFn: (payload?) => Api.Pomodoro.StopSession(payload),
    onSuccess: (res) => {
      ns.alert.toast({
        title: res.message,
        message: res.message,
        icon: 'success',
      });
    },
    onMutate: async () => {
      await ns.queryClient.cancelQueries({
        queryKey: podomoroRoot,
      });
      return { previousData: readPomodoroSnapshot(ns) };
    },
    onSettled: async () => {
      await ns.queryClient.invalidateQueries({
        queryKey: podomoroRoot,
      });
    },
    onError: (err) => {
      ns.alert.toast({
        title: err.message,
        message: err.message,
        icon: 'error',
      });
    },
  });
}
