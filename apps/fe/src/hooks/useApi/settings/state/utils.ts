import { queryKey } from '@/configs';
import type { AppNameSpace } from '@/hooks/useAppNameSpace';

export type SettingsCacheContext = {
  previousData?: any;
};

export function readSettingsSnapshot(ns: AppNameSpace): any | undefined {
  return ns.queryClient.getQueryData<any>(queryKey.settings.detail());
}
