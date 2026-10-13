import { useQuery } from '@tanstack/react-query';

import { queryKey } from '@/config/query-key';
import Api from '@/service/props.service';

export function useListTasks() {
  return useQuery({
    queryKey: queryKey.tasks.list(),
    queryFn: async () => {
      const res = await Api.Task.ListTasks();
      return res.data;
    },
  });
}

export function useGetTask(id: string) {
  return useQuery({
    queryKey: queryKey.tasks.detail(id),
    queryFn: async () => {
      const res = await Api.Task.GetTask(id);
      return res.data;
    },
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
    enabled: !!id,
  });
}

export function useListTaskStatuses() {
  return useQuery({
    queryKey: queryKey.tasks.statuses(),
    queryFn: async () => {
      const res = await Api.Task.ListStatuses();
      return res.data;
    },
  });
}

export function useListTaskPriorities() {
  return useQuery({
    queryKey: queryKey.tasks.priorities(),
    queryFn: async () => {
      const res = await Api.Task.ListPriorities();
      return res.data;
    },
  });
}
