import type { Department } from '@repo/types';
import type { QueryClient } from '@tanstack/react-query';

import { queryKey } from '@/config/query-key';

export type DepartmentCacheContext = {
  previousData?: Department[];
};

export function readDepartmentSnapshot(queryClient: QueryClient): Department[] | undefined {
  return queryClient.getQueryData<Department[]>(queryKey.departments.list());
}
