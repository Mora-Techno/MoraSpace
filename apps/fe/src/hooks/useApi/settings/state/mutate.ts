import { useMutation } from "@tanstack/react-query";
import { SettingsRoot } from "./utils";
import { useAppNameSpace } from "@/hooks/useAppNameSpace";
import Api from "@/services/api";
import type {
  PickUpdateSettings,
  Settings,
  TestEmail,
  TResponse,
} from "@repo/types";

export function useUpdateSettings() {
  const ns = useAppNameSpace();
  return useMutation<TResponse<Settings>, Error, PickUpdateSettings>({
    mutationFn: (payload: PickUpdateSettings) =>
      Api.Settings.UpdateSettings(payload),
    onSuccess: (res: TResponse<Settings>) => {
      ns.alert.toast({
        title: res.message,
        message: res.message,
        icon: "success",
      });
    },
    onSettled: async () => {
      await ns.queryClient.invalidateQueries({
        queryKey: SettingsRoot,
      });
    },
    onError: (err: Error) => {
      ns.alert.toast({
        title: err.message,
        message: err.message,
        icon: "error",
      });
    },
  });
}

export function useTestingEmail() {
  const ns = useAppNameSpace();
  return useMutation<TResponse<{ email: string }>, Error, TestEmail>({
    mutationFn: (payload) => Api.Settings.TestingEmail(payload),
    onSuccess: (res) => {
      ns.alert.toast({
        title: res.message,
        message: res.message,
        icon: "success",
      });
    },
    onSettled: async () => {
      await ns.queryClient.invalidateQueries({
        queryKey: SettingsRoot,
      });
    },
    onError: (err: Error) => {
      ns.alert.toast({
        title: err.message,
        message: err.message,
        icon: "error",
      });
    },
  });
}
