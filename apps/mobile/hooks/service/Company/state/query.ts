import { useQuery } from '@tanstack/react-query';

import { queryKey } from '@/config/query-key';
import Api from '@/service/props.service';

export function useGetMyCompany() {
  return useQuery({
    queryKey: queryKey.companies.me(),
    queryFn: async () => {
      const res = await Api.Company.MyCompany();
      return res.data;
    },
  });
}

export function useListAdmins() {
  return useQuery({
    queryKey: queryKey.companies.admins(),
    queryFn: async () => {
      const res = await Api.Company.ListAdmins();
      return res.data;
    },
  });
}
