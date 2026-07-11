import {
  PickLogin,
  PickRegister,
  PickVerifyMagicLink,
  TResponse,
} from "@repo/types";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { useAppNameSpace } from "@/hooks/useAppNameSpace";
import Api from "@/services/api";
import { saveTokens } from "@/server/auth-cookie";
import { persistAuthSessionFromResponse } from "@/utils/storage";
import { AuthSessionResponse } from "@repo/types/auth.types";

type AuthCacheContext = {
  previousData: unknown;
};

export function useLogin() {
  const ns = useAppNameSpace();
  const router = useRouter();

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
        await saveTokens({
          role: role,
          accessToken: accessToken,
          refreshToken: refreshToken,
        });
        persistAuthSessionFromResponse(data);
      }

      ns.alert.toast({
        title: res.message,
        message: res.message,
        icon: "success",
      });

      // setting routes berdasarkan role
      switch (role) {
        case "Admin":
          ns.router.push("/");
          break;
        case "Member":
          ns.router.push("/");
          break;
        case "Owner":
          ns.router.push("/");
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
  const router = useRouter();
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
      router.replace("/login");
    },
    onError: (err: Error) => {
      ns.alert.toast({
        title: err.message,
        message: err.message,
        icon: "error",
      });
      router.replace("/login");
    },
  });
}

export function useRegister() {
  const ns = useAppNameSpace();
  const router = useRouter();

  return useMutation({
    mutationFn: (payload: PickRegister) => Api.Auth.Register(payload),
    onSuccess: (res) => {
      ns.alert.toast({
        title: res.message,
        message: res.message,
        icon: "success",
      });
      router.replace("/");
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
    mutationFn: async (payload: PickVerifyMagicLink) =>
      Api.Auth.VerifyMagicLink(payload),
    onSuccess: (res) => {
      ns.alert.toast({
        message: res.message,
        title: res.message,
        icon: "success",
      });
      ns.router.push("/login");
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
