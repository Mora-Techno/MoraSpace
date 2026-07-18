import { useQuery } from "@tanstack/react-query";

import { queryKey } from "@/configs";
import Api from "@/services/api";

export function useGetMyCompany() {
  return useQuery({
    queryKey: queryKey.companies.me(),
    queryFn: async () => {
      const res = await Api.Company.GetCompanyProfile();
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
