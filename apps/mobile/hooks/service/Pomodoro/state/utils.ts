import type { IPomodoroSession } from '@repo/types';
import type { QueryClient } from '@tanstack/react-query';

import { queryKey } from '@/config/query-key';

export type PomodoroCacheContext = {
  previousData?: IPomodoroSession[];
};

export function readPomodoroSnapshot(queryClient: QueryClient): IPomodoroSession[] | undefined {
  return queryClient.getQueryData<IPomodoroSession[]>(queryKey.pomodoro.today());
}
