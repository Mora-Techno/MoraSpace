import type { TResponse } from '@repo/types';
import type { AuthSessionResponse, PickLogin, PickRegister } from '@repo/types/auth.types';
import { useMutation } from '@tanstack/react-query';
import { router } from 'expo-router';
import { Alert } from 'react-native';

import Api from '@/service/props.service';

export function useLogin() {
  return useMutation<TResponse<AuthSessionResponse>, Error, PickLogin>({
    mutationFn: (payload) => Api.Auth.Login(payload),
    onSuccess: (res) => {
      Alert.alert('Sukses', res.message ?? 'Login berhasil!');
      router.push('/(public)/home/_container/home');
    },
    onError: (err) => {
      Alert.alert('Error', err.message ?? 'Login gagal');
    },
  });
}

export function useRegister() {
  return useMutation<TResponse<unknown>, Error, PickRegister>({
    mutationFn: (payload) => Api.Auth.Register(payload),
    onSuccess: (res) => {
      Alert.alert('Sukses', res.message ?? 'Register berhasil!');
      router.push('/(public)/home/_container/home');
    },
    onError: (err) => {
      Alert.alert('Error', err.message ?? 'Register gagal');
    },
  });
}

export function useLogout() {
  return useMutation<TResponse<null>, Error, void>({
    mutationFn: () => Api.Auth.Logout(),
    onSuccess: () => {
      Alert.alert('Sukses', 'Logout berhasil!');
      router.replace('/');
    },
    onError: (err) => {
      Alert.alert('Error', err.message ?? 'Logout gagal');
      router.replace('/');
    },
  });
}
