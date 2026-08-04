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
import { useMutation } from "@tanstack/react-query";

import { useAppNameSpace } from "@/hooks/useAppNameSpace";
import { saveTokens } from "@/server/auth-cookie";
import Api from "@/services/api";
import { persistAuthSessionFromResponse } from "@/utils/storage";
import { AuthCacheContext } from "./utils";

export function useLogin() {
  const ns = useAppNameSpace();

  return useMutation<
    TResponse<AuthSessionResponse>,
    Error,
    PickLogin,
    AuthCacheContext
  >({
    mutationFn: (payload: PickLogin) => Api.Auth.Login(payload),
    onSuccess: async (res) => {
      const data = res.data;

      const accessToken = res?.data.accessToken;
      const refreshToken = res?.data.refreshToken;
      const role =
        (res?.data.user as Record<string, any>)?.companyRole ??
        (res?.data.user as Record<string, any>)?.role ??
        (res?.data as Record<string, any>)?.role ??
        "";

      if (accessToken && refreshToken) {
        persistAuthSessionFromResponse(data);

        try {
          await saveTokens({
            role: role || undefined,
            accessToken: accessToken,
            refreshToken: refreshToken,
          });
        } catch {}
      }

      ns.alert.toast({
        title: res.message,
        message: res.message,
        icon: "success",
      });

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
    onError: (err: Error) => {
      ns.alert.toast({
        title: err.message,
        message: err.message,
        icon: "error",
      });
    },
  });
}

export function useLogout() {
  const ns = useAppNameSpace();
  return useMutation({
    mutationFn: async () => {
      try {
        await Api.Auth.Logout();
      } catch {
        // Tetap logout lokal meski BE gagal
      }
      await fetch("/api/session/delete", { method: "POST" });
    },
    onSuccess: () => {
      ns.alert.toast({
        title: "Logout berhasil",
        message: "Sampai jumpa lagi!",
        icon: "success",
      });
      ns.router.replace("/login");
    },
    onError: (err: Error) => {
      ns.alert.toast({
        title: err.message,
        message: err.message,
        icon: "error",
      });
      ns.router.replace("/login");
    },
  });
}

export function useRegister() {
  const ns = useAppNameSpace();

  return useMutation<
    TResponse<SafeAuthUser>,
    Error,
    PickRegister,
    AuthCacheContext
  >({
    mutationFn: (payload: PickRegister) => Api.Auth.Register(payload),
    onSuccess: (res) => {
      ns.alert.toast({
        title: res.message,
        message: res.message,
        icon: "success",
      });
      ns.router.replace("/");
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

export function useVerifyMagicLink() {
  const ns = useAppNameSpace();

  return useMutation({
    mutationFn: (payload: PickVerifyMagicLink) =>
      Api.Auth.VerifyMagicLink(payload),
    onSuccess: (res) => {
      ns.alert.toast({
        message: res.message,
        title: res.message,
        icon: "success",
      });
    },
    onError: (err) => {
      ns.alert.toast({
        title: err.message,
        message: err.message,
        icon: "error",
      });
    },
  });
}

export function useSendMagicLink() {
  const ns = useAppNameSpace();

  return useMutation<
    TResponse<{ email: string }>,
    Error,
    PickSendMagicLink,
    AuthCacheContext
  >({
    mutationFn: (payload) => Api.Auth.SendMagicLink(payload),
    onSuccess: (res) => {
      ns.alert.toast({
        message: res.message,
        title: res.message,
        icon: "success",
      });
    },
    onError: (err) => {
      ns.alert.toast({
        title: err.message,
        message: err.message,
        icon: "error",
      });
    },
  });
}

export function useForgotPassword() {
  const ns = useAppNameSpace();

  return useMutation<
    TResponse<null>,
    Error,
    PickForgotPassword,
    AuthCacheContext
  >({
    mutationFn: (payload) => Api.Auth.ForgotPassword(payload),
    onSuccess: (res) => {
      ns.alert.toast({
        message: res.message,
        title: res.message,
        icon: "success",
      });
    },
    onError: (err) => {
      ns.alert.toast({
        title: err.message,
        message: err.message,
        icon: "error",
      });
    },
  });
}

export function useResetPassword() {
  const ns = useAppNameSpace();

  return useMutation<
    TResponse<null>,
    Error,
    PickResetPassword,
    AuthCacheContext
  >({
    mutationFn: (payload) => Api.Auth.ResetPassword(payload),
    onSuccess: (res) => {
      ns.alert.toast({
        message: res.message,
        title: res.message,
        icon: "success",
      });
    },
    onError: (err) => {
      ns.alert.toast({
        title: err.message,
        message: err.message,
        icon: "error",
      });
    },
  });
}
