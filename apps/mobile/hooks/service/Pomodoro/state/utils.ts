import type { PomodoroSession } from '@repo/types';
import type { QueryClient } from '@tanstack/react-query';

import { queryKey } from '@/config/query-key';

export type PomodoroCacheContext = {
  previousData?: PomodoroSession[];
};

export function readPomodoroSnapshot(queryClient: QueryClient): PomodoroSession[] | undefined {
  return queryClient.getQueryData<PomodoroSession[]>(queryKey.pomodoro.today());
}
