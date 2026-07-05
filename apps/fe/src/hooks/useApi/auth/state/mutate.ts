import { PickLogin, PickRegister } from "@repo/types";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { useAppNameSpace } from "@/hooks/useAppNameSpace";
import Api from "@/services/api";

export function useLogin() {
  const ns = useAppNameSpace();
  const router = useRouter();

  return useMutation({
    mutationFn: (payload: PickLogin) => Api.Auth.Login(payload),
    onSuccess: (res) => {
      //
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
