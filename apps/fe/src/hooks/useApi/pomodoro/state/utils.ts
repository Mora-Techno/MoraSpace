import type { PomodoroSession } from '@repo/types';

import { queryKey } from '@/configs';
import type { AppNameSpace } from '@/hooks/useAppNameSpace';

export type PomodoroCacheContext = {
  previousData?: PomodoroSession[];
};

export function readPomodoroSnapshot(ns: AppNameSpace): PomodoroSession[] | undefined {
  return ns.queryClient.getQueryData<PomodoroSession[]>(queryKey.pomodoro.today());
}
