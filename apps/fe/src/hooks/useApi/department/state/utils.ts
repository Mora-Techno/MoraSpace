import type { IDepartment } from '@repo/types';

import { queryKey } from '@/configs';
import type { AppNameSpace } from '@/hooks/useAppNameSpace';

export type DepartmentCacheContext = {
  previousData?: IDepartment[];
};

export function readDepartmentSnapshot(ns: AppNameSpace): IDepartment[] | undefined {
  return ns.queryClient.getQueryData<IDepartment[]>(queryKey.departments.list());
}

export const departmentRootKey = queryKey.departmentsRoot();
