import { useQuery } from '@tanstack/react-query';

import { queryKey } from '@/configs';
import Api from '@/services/api';

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
