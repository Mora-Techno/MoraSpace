import type { CompanyProfile } from '@repo/types';
import type { QueryClient } from '@tanstack/react-query';

import { queryKey } from '@/config/query-key';

export type CompanyCacheContext = {
  previousData?: CompanyProfile;
};

export function readCompanySnapshot(queryClient: QueryClient): CompanyProfile | undefined {
  return queryClient.getQueryData<CompanyProfile>(queryKey.companies.me());
}
