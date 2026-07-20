import type { CompanyProfile } from '@repo/types';

import { queryKey } from '@/configs';
import type { AppNameSpace } from '@/hooks/useAppNameSpace';

export type CompanyCacheContext = {
  previousData?: CompanyProfile;
};

export function readCompanySnapshot(ns: AppNameSpace): CompanyProfile | undefined {
  return ns.queryClient.getQueryData<CompanyProfile>(queryKey.companies.me());
}
export const companyRooyKey = queryKey.companiesRoot();
