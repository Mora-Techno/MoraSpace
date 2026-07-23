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
      // save LoginAccount Nantik
      const accessToken = res?.data.accessToken;
      const refreshToken = res?.data.refreshToken;
      const role = res?.data.user.companyRole;

      if (accessToken && role && refreshToken) {
        persistAuthSessionFromResponse(data);
        try {
          await saveTokens({
            role: role,
            accessToken: accessToken,
            refreshToken: refreshToken,
          });
        } catch {
          // Local session already exists; cookie persistence is best-effort here.
        }
      }

      ns.alert.toast({
        title: res.message,
        message: res.message,
        icon: "success",
      });

      // setting routes berdasarkan role
      switch (role) {
        case "Admin":
          ns.router.replace("/admin/dashboard");
          break;
        case "Member":
          ns.router.replace("/member/dashboard");
          break;
        case "Owner":
          ns.router.replace("/home");
          break;
        default:
          ns.router.replace("/home");
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
