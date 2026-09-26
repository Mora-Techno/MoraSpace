import type { PickUpdateSettings, Settings } from "@repo/types";
import { useAppMutation } from "@/hooks/useAppMutation";
import Api from "@/service/props.service";
import { readSettingsSnapshot, type SettingsCacheContext, SettingsRoot } from "./utils";

export function useUpdateSettings() {
  return useAppMutation<Settings, PickUpdateSettings, SettingsCacheContext>({
    mutationFn: (payload) => Api.Settings.UpdateSettings(payload),
    invalidateKeys: [SettingsRoot],
    optimistic: (ns) => ({ previousData: readSettingsSnapshot(ns) }),
  });
}
