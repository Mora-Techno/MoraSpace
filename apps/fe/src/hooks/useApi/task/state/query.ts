import { MODULE_QUERY } from '@repo/config/query-stale';
import { useQuery } from '@tanstack/react-query';

import { queryKey } from '@/configs';
import Api from '@/services/api';

export function useListTasks(query?: import('@repo/types').TaskQuery) {
  return useQuery({
    queryKey: queryKey.tasks.list(query),
    queryFn: async () => {
      const res = await Api.Task.ListTasks(query);
      return res.data;
    },
    staleTime: MODULE_QUERY,
  });
}

export function useListTaskStatuses() {
  return useQuery({
    queryKey: queryKey.tasks.statuses(),
    queryFn: async () => {
      const res = await Api.Task.ListStatuses();
      return res.data;
    },
    staleTime: MODULE_QUERY,
  });
}

export function useListTaskPriorities() {
  return useQuery({
    queryKey: queryKey.tasks.priorities(),
    queryFn: async () => {
      const res = await Api.Task.ListPriorities();
      return res.data;
    },
    staleTime: MODULE_QUERY,
  });
}

export function useGetTask(id: string) {
  return useQuery({
    queryKey: queryKey.tasks.detail(id),
    queryFn: async () => {
      const res = await Api.Task.GetTask(id);
      return res.data;
    },
    staleTime: MODULE_QUERY,
    enabled: !!id,
  });
}

export function useListTaskActivities(id: string) {
  return useQuery({
    queryKey: queryKey.tasks.activities(id),
    queryFn: async () => {
      const res = await Api.Task.ListActivities(id);
      return res.data;
    },
    staleTime: MODULE_QUERY,
    enabled: !!id,
  });
}
