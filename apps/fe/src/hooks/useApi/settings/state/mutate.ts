import type {
  PickUpdateSettings,
  Settings,
  TestEmail,
} from "@repo/types";

import { useAppMutation } from "@/hooks/useAppMutation";
import Api from "@/services/api";
import { SettingsRoot } from "./utils";

export function useUpdateSettings() {
  return useAppMutation<Settings, PickUpdateSettings>({
    mutationFn: (payload: PickUpdateSettings) =>
      Api.Settings.UpdateSettings(payload),
    invalidateKeys: [SettingsRoot],
  });
}

export function useTestingEmail() {
  return useAppMutation<{ email: string }, TestEmail>({
    mutationFn: (payload) => Api.Settings.TestingEmail(payload),
    invalidateKeys: [SettingsRoot],
  });
}
