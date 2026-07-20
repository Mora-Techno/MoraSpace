import type { IPomodoroSession } from '@repo/types';

import { queryKey } from '@/configs';
import type { AppNameSpace } from '@/hooks/useAppNameSpace';

export type PomodoroCacheContext = {
  previousData?: IPomodoroSession[];
};

export function readPomodoroSnapshot(ns: AppNameSpace): IPomodoroSession[] | undefined {
  return ns.queryClient.getQueryData<IPomodoroSession[]>(queryKey.pomodoro.today());
}

export const podomoroRoot = queryKey.pomodoroRoot();
