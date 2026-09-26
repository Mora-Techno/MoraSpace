import type {
  IPomodoroSession,
  PickStartPomodoro,
  PickStopPomodoro,
} from "@repo/types";
import { queryKey } from "@/config/query-key";
import { useAppMutation } from "@/hooks/useAppMutation";
import Api from "@/service/props.service";
import {
  type PomodoroCacheContext,
  podomoroRoot,
  readPomodoroSnapshot,
} from "./utils";

export function useStartPomodoroSession() {
  return useAppMutation<
    IPomodoroSession,
    PickStartPomodoro | undefined,
    PomodoroCacheContext
  >({
    mutationFn: (payload) => Api.Pomodoro.StartSession(payload),
    invalidateKeys: [podomoroRoot, queryKey.pomodoroRoot()],
    optimistic: (ns) => ({ previousData: readPomodoroSnapshot(ns) }),
  });
}

export function usePausePomodoroSession() {
  return useAppMutation<IPomodoroSession, void, PomodoroCacheContext>({
    mutationFn: () => Api.Pomodoro.PauseSession(),
    invalidateKeys: [podomoroRoot, queryKey.pomodoroRoot()],
    optimistic: (ns) => ({ previousData: readPomodoroSnapshot(ns) }),
  });
}

export function useResumePomodoroSession() {
  return useAppMutation<IPomodoroSession, void, PomodoroCacheContext>({
    mutationFn: () => Api.Pomodoro.ResumeSession(),
    invalidateKeys: [podomoroRoot, queryKey.pomodoroRoot()],
    optimistic: (ns) => ({ previousData: readPomodoroSnapshot(ns) }),
  });
}

export function useStopPomodoroSession() {
  return useAppMutation<
    IPomodoroSession,
    PickStopPomodoro | undefined,
    PomodoroCacheContext
  >({
    mutationFn: (payload) => Api.Pomodoro.StopSession(payload),
    invalidateKeys: [podomoroRoot, queryKey.pomodoroRoot()],
    optimistic: (ns) => ({ previousData: readPomodoroSnapshot(ns) }),
  });
}
