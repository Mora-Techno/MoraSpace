import type {
  AuthSessionResponse,
  PickLogin,
  PickRegister,
} from "@repo/types/auth.types";
import { useAppMutation } from "@/hooks/useAppMutation";
import Api from "@/service/props.service";

export function useLogin() {
  return useAppMutation<AuthSessionResponse, PickLogin>({
    mutationFn: (payload) => Api.Auth.Login(payload),
  });
}

export function useRegister() {
  return useAppMutation<unknown, PickRegister>({
    mutationFn: (payload) => Api.Auth.Register(payload),
    onSuccess: (_res, _vars, _ctx, ns) => {
      ns.router.push("/(public)/home/_container/home");
    },
  });
}

export function useLogout() {
  return useAppMutation<null, void>({
    mutationFn: () => Api.Auth.Logout(),
    onSuccess: (_res, _vars, _ctx, ns) => {
      ns.router.replace("/");
    },
    onError: (_err, _vars, _ctx, ns) => {
      ns.router.replace("/");
    },
  });
}
