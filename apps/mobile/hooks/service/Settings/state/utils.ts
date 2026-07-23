import type { Settings } from '@repo/types';
import type { QueryClient } from '@tanstack/react-query';

import { queryKey } from '@/config/query-key';

export type SettingsCacheContext = {
  previousData?: Settings;
};

export function readSettingsSnapshot(queryClient: QueryClient): Settings | undefined {
  return queryClient.getQueryData<Settings>(queryKey.settings.detail());
}
