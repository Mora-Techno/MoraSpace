import type { IDepartment } from '@repo/types';
import type { QueryClient } from '@tanstack/react-query';

import { queryKey } from '@/config/query-key';

export type DepartmentCacheContext = {
  previousData?: IDepartment[];
};

export function readDepartmentSnapshot(queryClient: QueryClient): IDepartment[] | undefined {
  return queryClient.getQueryData<IDepartment[]>(queryKey.departments.list());
}
