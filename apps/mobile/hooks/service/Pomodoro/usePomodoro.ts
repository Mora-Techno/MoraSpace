import {
  usePausePomodoroSession,
  useResumePomodoroSession,
  useStartPomodoroSession,
  useStopPomodoroSession,
} from './state/mutate';
import { useGetPomodoroStatistics, useGetTodayFocus } from './state/query';

export const usePomodoro = () => {
  return {
    mutate: {
      start: useStartPomodoroSession,
      pause: usePausePomodoroSession,
      resume: useResumePomodoroSession,
      stop: useStopPomodoroSession,
    },
    query: {
      today: useGetTodayFocus,
      statistics: useGetPomodoroStatistics,
    },
  };
};
