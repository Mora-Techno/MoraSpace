import { useQuery } from "@tanstack/react-query";

import { queryKey } from "@/configs";
import Api from "@/services/api";
import { MODULE_QUERY } from "@repo/config/query-stale";

export function useListTasks() {
  return useQuery({
    queryKey: queryKey.tasks.list(),
    queryFn: async () => {
      const res = await Api.Task.ListTasks();
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
