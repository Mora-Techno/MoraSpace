import { queryKey } from "@/configs";
import type { AppNameSpace } from "@/hooks/useAppNameSpace";
import type { Settings } from "@repo/types";

export type SettingsCacheContext = {
  previousData?: Settings;
};

export function readSettingsSnapshot(ns: AppNameSpace): Settings | undefined {
  return ns.queryClient.getQueryData<Settings>(queryKey.settings.detail());
}
