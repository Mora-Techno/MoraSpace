import { useMutation } from '@tanstack/react-query';

import { queryKey } from '@/configs';
import { useAppNameSpace } from '@/hooks/useAppNameSpace';
import Api from '@/services/api';

export function useStartPomodoroSession() {
  const ns = useAppNameSpace();
  return useMutation({
    mutationFn: (payload?: any) => Api.Pomodoro.StartSession(payload),
    onSuccess: (res: any) => {
      ns.alert.toast({ title: res.message, message: res.message, icon: 'success' });
    },
    onSettled: async () => {
      await ns.queryClient.invalidateQueries({ queryKey: queryKey.pomodoroRoot() });
    },
    onError: (err: any) => {
      ns.alert.toast({ title: err.message, message: err.message, icon: 'error' });
    },
  });
}

export function usePausePomodoroSession() {
  const ns = useAppNameSpace();
  return useMutation({
    mutationFn: () => Api.Pomodoro.PauseSession(),
    onSuccess: (res: any) => {
      ns.alert.toast({ title: res.message, message: res.message, icon: 'success' });
    },
    onSettled: async () => {
      await ns.queryClient.invalidateQueries({ queryKey: queryKey.pomodoroRoot() });
    },
    onError: (err: any) => {
      ns.alert.toast({ title: err.message, message: err.message, icon: 'error' });
    },
  });
}

export function useResumePomodoroSession() {
  const ns = useAppNameSpace();
  return useMutation({
    mutationFn: () => Api.Pomodoro.ResumeSession(),
    onSuccess: (res: any) => {
      ns.alert.toast({ title: res.message, message: res.message, icon: 'success' });
    },
    onSettled: async () => {
      await ns.queryClient.invalidateQueries({ queryKey: queryKey.pomodoroRoot() });
    },
    onError: (err: any) => {
      ns.alert.toast({ title: err.message, message: err.message, icon: 'error' });
    },
  });
}

export function useStopPomodoroSession() {
  const ns = useAppNameSpace();
  return useMutation({
    mutationFn: (payload?: any) => Api.Pomodoro.StopSession(payload),
    onSuccess: (res: any) => {
      ns.alert.toast({ title: res.message, message: res.message, icon: 'success' });
    },
    onSettled: async () => {
      await ns.queryClient.invalidateQueries({ queryKey: queryKey.pomodoroRoot() });
    },
    onError: (err: any) => {
      ns.alert.toast({ title: err.message, message: err.message, icon: 'error' });
    },
  });
}
