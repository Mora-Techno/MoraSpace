import type { AuthSessionResponse, PickLogin, PickRegister } from '@repo/types/auth.types';
import { useAppMutation } from '@/hooks/useAppMutation';
import { saveAuthTokens } from '@/service/auth-storage';
import Api from '@/service/props.service';
import { setCurrentUser } from '@/stores/authSlice/authSlice';
import { store } from '@/stores/store';

export function useLogin() {
  return useAppMutation<AuthSessionResponse, PickLogin>({
    mutationFn: (payload) => Api.Auth.Login(payload),
    onSuccess: (res, _vars, _ctx, ns) => {
      const data = res?.data;
      if (data?.accessToken) {
        void saveAuthTokens(data.accessToken, data.refreshToken);
        // Simpan sesi minimal ke redux agar guard & token provider punya token.
        // TODO: petakan SafeAuthUser -> userSchema saat kontrak backend stabil.
        try {
          store.dispatch(
            setCurrentUser({
              user: {
                token: data.accessToken,
                email: data.user?.email ?? '',
                fullName: data.user?.fullName ?? 'User',
              },
            } as never),
          );
        } catch {}
      }
      ns.router.replace('/(private)/(tabs)/home/page');
    },
  });
}

export function useRegister() {
  return useAppMutation<unknown, PickRegister>({
    mutationFn: (payload) => Api.Auth.Register(payload),
    onSuccess: (_res, _vars, _ctx, ns) => {
      ns.router.push('/(public)/home/page');
    },
  });
}

export function useLogout() {
  return useAppMutation<null, void>({
    mutationFn: () => Api.Auth.Logout(),
    onSuccess: (_res, _vars, _ctx, ns) => {
      ns.router.replace('/');
    },
    onError: (_err, _vars, _ctx, ns) => {
      ns.router.replace('/');
    },
  });
}
