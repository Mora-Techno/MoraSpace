import type { QueryClient } from '@tanstack/react-query';

import { queryKey } from '@/config/query-key';

export type SettingsCacheContext = {
  previousData?: any;
};

export function readSettingsSnapshot(queryClient: QueryClient): any | undefined {
  return queryClient.getQueryData<any>(queryKey.settings.detail());
}
