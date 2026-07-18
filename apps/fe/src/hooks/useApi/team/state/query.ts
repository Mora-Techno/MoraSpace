import { useQuery } from "@tanstack/react-query";

import { queryKey } from "@/configs";
import Api from "@/services/api";
import { MODULE_QUERY } from "@repo/config/query-stale";

export function useListTeams(query?: { departmentId?: string }) {
  return useQuery({
    queryKey: queryKey.teams.list(query),
    queryFn: async () => {
      const res = await Api.Team.ListTeams(query);
      return res.data;
    },
    staleTime: MODULE_QUERY,
  });
}

export function useListTeamMembers(id: string) {
  return useQuery({
    queryKey: queryKey.teams.members(id),
    queryFn: async () => {
      const res = await Api.Team.ListMembers(id);
      return res.data;
    },
    staleTime: MODULE_QUERY,
    enabled: !!id,
  });
}
