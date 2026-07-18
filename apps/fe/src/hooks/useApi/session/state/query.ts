import { useQuery } from "@tanstack/react-query";

import { queryKey } from "@/configs";
import Api from "@/services/api";
import { MODULE_QUERY } from "@repo/config/query-stale";

export function useListSessions() {
  return useQuery({
    queryKey: queryKey.session.list(),
    queryFn: async () => {
      const res = await Api.Session.ListSession();
      return res.data;
    },
    staleTime: MODULE_QUERY,
  });
}

export function useGetSession(id: string) {
  return useQuery({
    queryKey: queryKey.session.detail(id),
    queryFn: async () => {
      const res = await Api.Session.SessionById(id);
      return res.data;
    },
    staleTime: MODULE_QUERY,
    enabled: !!id,
  });
}
