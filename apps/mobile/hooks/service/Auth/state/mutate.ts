import type { TResponse } from "@repo/types";
import type {
  AuthSessionResponse,
  PickLogin,
  PickRegister,
} from "@repo/types/auth.types";
import { useMutation } from "@tanstack/react-query";
import { router } from "expo-router";
import { Alert } from "react-native";

import Api from "@/service/props.service";
import { useAppNameSpace } from "@/hooks/useAppNameSpace";

export function useLogin() {
  const ns = useAppNameSpace();
  return useMutation<TResponse<AuthSessionResponse>, Error, PickLogin>({
    mutationFn: (payload) => Api.Auth.Login(payload),
    onSuccess: (res) => {
      ns.alert.toast({
        title: res.message,
        message: res.message,
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

export function useRegister() {
  return useMutation<TResponse<unknown>, Error, PickRegister>({
    mutationFn: (payload) => Api.Auth.Register(payload),
    onSuccess: (res) => {
      Alert.alert("Sukses", res.message ?? "Register berhasil!");
      router.push("/(public)/home/_container/home");
    },
    onError: (err) => {
      Alert.alert("Error", err.message ?? "Register gagal");
    },
  });
}

export function useLogout() {
  return useMutation<TResponse<null>, Error, void>({
    mutationFn: () => Api.Auth.Logout(),
    onSuccess: () => {
      Alert.alert("Sukses", "Logout berhasil!");
      router.replace("/");
    },
    onError: (err) => {
      Alert.alert("Error", err.message ?? "Logout gagal");
      router.replace("/");
    },
  });
}
