import { useQuery } from '@tanstack/react-query';

import { queryKey } from '@/config/query-key';
import Api from '@/service/props.service';

export function useListSessions() {
  return useQuery({
    queryKey: queryKey.session.list(),
    queryFn: async () => {
      const res = await Api.Session.ListSession();
      return res.data;
    },
  });
}

export function useGetSession(id: string) {
  return useQuery({
    queryKey: queryKey.session.detail(id),
    queryFn: async () => {
      const res = await Api.Session.SessionById(id);
      return res.data;
    },
    enabled: !!id,
  });
}
