'use client';
import { PickLogin } from '@repo/types';
import { useState } from 'react';

import LoginSection from '@/components/section/auth/login/page-section';
import { useApi } from '@/hooks/service/useApi';
import { useAppNameSpace } from '@/hooks/useAppNameSpace';
const LoginContainer = () => {
  const api = useApi();
  const ns = useAppNameSpace();
  const [formLogin, setFormLogin] = useState<PickLogin>({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState<boolean>(false);

  // api call
  const useLogin = api.auth.mutate.login();

  const handleLogin = () => {
    if (!formLogin.email || !formLogin.password) {
      ns.alert.toast({
        title: 'Validasi',
        message: 'Email dan password wajib diisi',
        icon: 'warning',
      });
      return;
    }
    const payload = formLogin;
    useLogin.mutate(payload);
  };

  return (
    <LoginSection
      state={{
        formLogin,
        setFormLogin,
        setShowPassword,
        showPassword,
        alert: ns.alert,
      }}
      service={{
        isPending: useLogin.isPending,
        onLogin: handleLogin,
        onRegister: () => ns.router.push('/(auth)/register/page'),
      }}
    />
  );
};

export default LoginContainer;
