import { useQuery } from '@tanstack/react-query';

import { queryKey } from '@/config/query-key';
import Api from '@/service/props.service';

export function useListDepartments() {
  return useQuery({
    queryKey: queryKey.departments.list(),
    queryFn: async () => {
      const res = await Api.Department.ListDepartments();
      return res.data;
    },
  });
}

export function useGetDepartment(id: string) {
  return useQuery({
    queryKey: queryKey.departments.detail(id),
    queryFn: async () => {
      const res = await Api.Department.GetDepartment(id);
      return res.data;
    },
    enabled: !!id,
  });
}
