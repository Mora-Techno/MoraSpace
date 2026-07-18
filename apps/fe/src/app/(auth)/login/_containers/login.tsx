'use client';

import { useGoogleLogin } from '@react-oauth/google';
import { PickLogin } from '@repo/types';
import { Leaf } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

import { GoogleSvg } from '@/components/atoms/svg';
import { RegisterCard } from '@/components/molecules';
import { GhibliCard } from '@/components/molecules/ghibli-card';
import { LoginFormSection } from '@/components/page/auth';
import { RegisterConfigRoutes } from '@/configs';
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
    login.mutateAsync(payload);
  };

  const googleLogin = useGoogleLogin({
    flow: 'auth-code',
    onSuccess: async (codeResponse) => {
      // service.mutation.onLoginGoogle(codeResponse.code);
      console.log('login google');
    },
    onError: (err) => {
      console.log('Google Login Failed', err);
    },
  });
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <GhibliCard className="w-full max-w-md" hover={false}>
        <div className="mb-6 flex flex-col items-center gap-2 text-center">
          <Leaf className="size-8 text-primary" />
          <h1 className="font-serif text-2xl font-semibold">Selamat Datang</h1>
        </div>
        <div className="w-full flex justify-center items-center flex-col space-y-3">
          <button type="button" onClick={() => googleLogin()}>
            <GoogleSvg />
          </button>
          <h1 className="text-sm font-semibold text-muted-foreground">Atau Masuk Menggunakan</h1>
        </div>
        <LoginFormSection
          service={{
            handleSubmit: handleSubmit,
            isPending: login.isPending,
          }}
          state={{
            formLogin: formLogin,
            setFormLogin: setFormLogin,
            setShowPassword: setShowPassword,
            showPassword: showPassword,
          }}
        />
        {RegisterConfigRoutes.map((items, key) => {
          const Icon = items.icon;
          return (
            <div key={key} className="w-full flex gap-1">
              <RegisterCard href={items.href} title={items.title} icon={Icon} />
            </div>
          );
        })}
        <div className="w-full flex justify-between items-center">
          <p className="mt-2 text-sm">
            <Link href="/" className="text-muted-foreground hover:text-primary">
              Kembali ke beranda
            </Link>
          </p>

          <Link href={'/forgot-password'} className="text-muted-foreground hover:text-primary">
            <p className="text-sm">Lupa Kata Sandi</p>
          </Link>
        </div>
      </GhibliCard>
    </div>
  );
}
