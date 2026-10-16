'use client';

import { useGoogleLogin } from '@react-oauth/google';
import type { PickLogin } from '@repo/types';
import Link from 'next/link';
import { useState } from 'react';

import GoogleSignInButton from '@/components/molecules/GoogleSignButton';
import { LoginPageSection } from '@/components/page/auth/login-page.section';
import { useApi } from '@/hooks/useApi/useApi';

export default function LoginContainer() {
  const api = useApi();
  const [formLogin, setFormLogin] = useState<PickLogin>({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const login = api.auth.mutate.login();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = formLogin;
    login.mutateAsync(payload).catch(() => {});
  };

  const googleLogin = useGoogleLogin({
    flow: 'auth-code',
    onSuccess: async (_codeResponse) => {
      console.log('login google');
    },
    onError: (err) => {
      console.log('Google Login Failed', err);
    },
  });

  return (
    <LoginPageSection
      service={{
        isPending: login.isPending,
        onSubmit: handleSubmit,
        onGoogleLogin: googleLogin,
      }}
      state={{
        formLogin,
        setFormLogin,
        showPassword,
        setShowPassword,
      }}
    />
  );
}
