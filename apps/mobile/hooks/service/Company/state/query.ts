import { useQuery } from '@tanstack/react-query';

import { queryKey } from '@/config/query-key';
import Api from '@/service/props.service';

export function useGetMyCompany(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: queryKey.companies.me(),
    queryFn: async () => {
      const res = await Api.Company.GetCompanyProfile();
      return res.data;
    },
    enabled: options?.enabled ?? true,
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

export function useGetCompanySettings() {
  return useQuery({
    queryKey: queryKey.companies.settings(),
    queryFn: async () => {
      const res = await Api.Company.GetCompanySettings();
      return res.data;
    },
  });
}
