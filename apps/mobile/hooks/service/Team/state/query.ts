import { useQuery } from '@tanstack/react-query';

import { queryKey } from '@/config/query-key';
import Api from '@/service/props.service';

export function useListTeams(query?: { departmentId?: string }) {
  return useQuery({
    queryKey: queryKey.teams.list(query),
    queryFn: async () => {
      const res = await Api.Team.ListTeams(query);
      return res.data;
    },
  });
}

export function useListTeamMembers(id: string) {
  return useQuery({
    queryKey: queryKey.teams.members(id),
    queryFn: async () => {
      const res = await Api.Team.ListMembers(id);
      return res.data;
    },
    enabled: !!id,
  });
}
