import { useQuery } from "@tanstack/react-query";
import { MODULE_QUERY } from "@repo/config/query-stale";
import { queryKey } from "@/configs";
import Api from "@/services/api";

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

export function useListAdmins() {
  return useQuery({
    queryKey: queryKey.companies.admins(),
    queryFn: async () => {
      const res = await Api.Company.ListAdmins();
      return res.data;
    },
    staleTime: MODULE_QUERY,
  });
}
