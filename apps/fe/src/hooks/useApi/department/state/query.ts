import { useQuery } from "@tanstack/react-query";
import { MODULE_QUERY } from "@repo/config/query-stale";
import { queryKey } from "@/configs";
import Api from "@/services/api";

export function useListDepartments() {
  return useQuery({
    queryKey: queryKey.departments.list(),
    queryFn: async () => {
      const res = await Api.Department.ListDepartments();
      return res.data;
    },
    staleTime: MODULE_QUERY,
  });
}

export function useGetDepartment(id: string) {
  return useQuery({
    queryKey: queryKey.departments.detail(id),
    queryFn: async () => {
      const res = await Api.Department.GetDepartment(id);
      return res.data;
    },
    staleTime: MODULE_QUERY,
    enabled: !!id,
  });
}
