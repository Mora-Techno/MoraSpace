import { useQuery } from "@tanstack/react-query";
import { MODULE_QUERY_STALE_TIME } from "./utils";
import { queryKey } from "@/configs";
import Api from "@/services/api";

export function useListDepartments() {
  return useQuery({
    queryKey: queryKey.departments.list(),
    queryFn: async () => {
      const res = await Api.Department.ListDepartments();
      return res.data;
    },
    staleTime: MODULE_QUERY_STALE_TIME,
  });
}

export function useGetDepartment(id: string) {
  return useQuery({
    queryKey: queryKey.departments.detail(id),
    queryFn: async () => {
      const res = await Api.Department.GetDepartment(id);
      return res.data;
    },
    staleTime: MODULE_QUERY_STALE_TIME,
    enabled: !!id,
  });
}
