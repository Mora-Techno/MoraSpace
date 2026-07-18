import { useQuery } from '@tanstack/react-query';

import { queryKey } from '@/configs';
import Api from '@/services/api';

export function useGetTodayFocus() {
  return useQuery({
    queryKey: queryKey.pomodoro.today(),
    queryFn: async () => {
      const res = await Api.Pomodoro.GetTodayFocus();
      return res.data;
    },
  });
}

export function useGetPomodoroStatistics() {
  return useQuery({
    queryKey: queryKey.pomodoro.statistics(),
    queryFn: async () => {
      const res = await Api.Pomodoro.GetStatistics();
      return res.data;
    },
  });
}
