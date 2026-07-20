import { MODULE_QUERY } from '@repo/config/query-stale';
import { useQuery } from '@tanstack/react-query';

import { queryKey } from '@/configs';
import Api from '@/services/api';

export function useListMembers() {
  return useQuery({
    queryKey: queryKey.members.list(),
    queryFn: async () => {
      const res = await Api.Member.ListMembers();
      return res.data;
    },
    staleTime: MODULE_QUERY,
  });
}

export function useGetMember(id: string) {
  return useQuery({
    queryKey: queryKey.members.detail(id),
    queryFn: async () => {
      const res = await Api.Member.GetMember(id);
      return res.data;
    },
    staleTime: MODULE_QUERY,
    enabled: !!id,
  });
}

export function useGetProfile(id: string) {
  return useQuery({
    queryKey: queryKey.members.profile(id),
    queryFn: async () => {
      const res = await Api.Member.GetProfile(id);
      return res.data;
    },
    staleTime: MODULE_QUERY,
    enabled: !!id,
  });
}

export function useGetContacts(id: string) {
  return useQuery({
    queryKey: queryKey.members.contacts(id),
    queryFn: async () => {
      const res = await Api.Member.GetContacts(id);
      return res.data;
    },
    staleTime: MODULE_QUERY,
    enabled: !!id,
  });
}
