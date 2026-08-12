import { MODULE_QUERY } from "@repo/config/query-stale";
import { useQuery } from "@tanstack/react-query";

import { queryKey } from "@/configs";
import Api from "@/services/api";
import { CompanyQuery } from "@repo";

export function useGetMyCompany() {
  return useQuery({
    queryKey: queryKey.companies.me(),
    queryFn: async () => {
      const res = await Api.Company.GetCompanyProfile();
      return res.data;
    },
    staleTime: MODULE_QUERY,
  });
}

export function useListAdmins(query?: CompanyQuery) {
  return useQuery({
    queryKey: [queryKey.companies.admins(), query],
    queryFn: async () => {
      const res = await Api.Company.ListAdmins();
      return res.data;
    },
    staleTime: MODULE_QUERY,
  });
}
