import type {
  PickLogin,
  PickRegister,
  PickVerifyMagicLink,
  TResponse,
} from "@repo/types";
import type {
  AuthSessionResponse,
  PickForgotPassword,
  PickResetPassword,
  PickSendMagicLink,
  SafeAuthUser,
} from "@repo/types/auth.types";

import { queryKey } from "@/configs";
import { useAppMutation } from "@/hooks/useAppMutation";
import { saveTokens } from "@/server/auth-cookie";
import Api from "@/services/api";
import { persistAuthSessionFromResponse } from "@/utils/storage";
import type { AuthCacheContext } from "./utils";

export function useLogin() {
  return useAppMutation<AuthSessionResponse, PickLogin, AuthCacheContext>({
    mutationFn: (payload: PickLogin) => Api.Auth.Login(payload),
    onSuccess: async (res, _vars, _ctx, ns) => {
      const data = res.data;
      const accessToken = res?.data.accessToken;
      const refreshToken = res?.data.refreshToken;
      const role = res?.data.user?.companyRole ?? "";

      if (accessToken && refreshToken) {
        persistAuthSessionFromResponse(data);

        try {
          await saveTokens({
            role: role || undefined,
            accessToken,
            refreshToken,
          });
        } catch {}

        try {
          await ns.queryClient.prefetchQuery({
            queryKey: queryKey.settings.detail(),
            queryFn: async () => {
              const settingsRes = await Api.Settings.GetSettings();
              return settingsRes.data;
            },
          });
        } catch {}
      }

      const normalizedRole = role?.toLowerCase();
      switch (normalizedRole) {
        case "admin":
          ns.router.replace("/admin/dashboard");
          break;
        case "owner":
          ns.router.replace("/owner/dashboard");
          break;
        case "member":
        case "developer":
        default:
          ns.router.replace("/member/dashboard");
          break;
      }
    },
  });
}

export function useLogout() {
  return useAppMutation<void, void>({
    mutationFn: async () => {
      try {
        await Api.Auth.Logout();
      } catch {}
      await fetch("/api/session/delete", { method: "POST" });
      return {
        data: undefined as unknown as void,
        message: "Logout berhasil",
        statusCode: 200,
        status: 200,
        title: "Logout berhasil",
      } as unknown as TResponse<void>;
    },
    onSuccess: (_data, _vars, _ctx, ns) => {
      ns.router.replace("/login");
    },
    onError: (_err, _vars, _ctx, ns) => {
      ns.router.replace("/login");
    },
  });
}

export function useRegister() {
  return useAppMutation<SafeAuthUser, PickRegister, AuthCacheContext>({
    mutationFn: (payload: PickRegister) => Api.Auth.Register(payload),
    onSuccess: (_res, _vars, _ctx, ns) => {
      ns.router.replace("/");
    },
  });
}

export function useVerifyMagicLink() {
  return useAppMutation<AuthSessionResponse, PickVerifyMagicLink>({
    mutationFn: (payload: PickVerifyMagicLink) =>
      Api.Auth.VerifyMagicLink(payload),
  });
}

export function useSendMagicLink() {
  return useAppMutation<{ email: string }, PickSendMagicLink, AuthCacheContext>({
    mutationFn: (payload) => Api.Auth.SendMagicLink(payload),
  });
}

export function useForgotPassword() {
  return useAppMutation<null, PickForgotPassword, AuthCacheContext>({
    mutationFn: (payload) => Api.Auth.ForgotPassword(payload),
  });
}

export function useResetPassword() {
  return useAppMutation<null, PickResetPassword, AuthCacheContext>({
    mutationFn: (payload) => Api.Auth.ResetPassword(payload),
  });
}
