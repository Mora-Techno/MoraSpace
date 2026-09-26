import type {
  IPomodoroSession,
  PickStartPomodoro,
  PickStopPomodoro,
} from "@repo/types";

import { useAppMutation } from "@/hooks/useAppMutation";
import Api from "@/services/api";

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
    mutationFn: (payload?) => Api.Pomodoro.StartSession(payload),
    invalidateKeys: [podomoroRoot],
    optimistic: (ns) => ({ previousData: readPomodoroSnapshot(ns) }),
  });
}

export function usePausePomodoroSession() {
  return useAppMutation<IPomodoroSession, void, PomodoroCacheContext>({
    mutationFn: () => Api.Pomodoro.PauseSession(),
    invalidateKeys: [podomoroRoot],
    optimistic: (ns) => ({ previousData: readPomodoroSnapshot(ns) }),
  });
}

export function useResumePomodoroSession() {
  return useAppMutation<IPomodoroSession, void, PomodoroCacheContext>({
    mutationFn: () => Api.Pomodoro.ResumeSession(),
    invalidateKeys: [podomoroRoot],
    optimistic: (ns) => ({ previousData: readPomodoroSnapshot(ns) }),
  });
}

export function useStopPomodoroSession() {
  return useAppMutation<
    IPomodoroSession,
    PickStopPomodoro | undefined,
    PomodoroCacheContext
  >({
    mutationFn: (payload?) => Api.Pomodoro.StopSession(payload),
    invalidateKeys: [podomoroRoot],
    optimistic: (ns) => ({ previousData: readPomodoroSnapshot(ns) }),
  });
}
