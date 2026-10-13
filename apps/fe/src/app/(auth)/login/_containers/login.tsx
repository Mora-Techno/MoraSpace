'use client';

import { useGoogleLogin } from '@react-oauth/google';
import type { PickLogin } from '@repo/types';
import Link from 'next/link';
import { useState } from 'react';

import GoogleSignInButton from '@/components/molecules/GoogleSignButton';
import { LoginFormSection } from '@/components/page/auth';
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
    <div className="w-full space-y-6">
      {/* Form Header */}
      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Selamat datang kembali
        </h1>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Masuk untuk melanjutkan ke ruang kerja Spaces Anda.
        </p>
      </div>

      {/* Main Login Form */}
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

      {/* Divider */}
      <div className="relative flex items-center justify-center my-4">
        <div className="w-full border-t border-border/60" />
        <span className="absolute bg-background px-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
          atau
        </span>
      </div>

      {/* Social Logins */}
      <div className="w-full">
        <GoogleSignInButton
          onSuccess={googleLogin}
          disabled={false}
          className="rounded-xl border-border/70 bg-card/60 hover:bg-muted font-medium text-sm py-2.5"
        />
      </div>

      {/* Footer Links */}
      <div className="space-y-2 pt-2 text-center text-sm">
        <p className="text-muted-foreground">
          Belum punya akun?{' '}
          <Link href="/register/company" className="font-semibold text-primary hover:underline">
            Mulai ruang kerja baru
          </Link>
        </p>
        <p className="text-xs text-muted-foreground">
          Bergabung sebagai tim?{' '}
          <Link href="/register/employ" className="font-medium text-foreground hover:underline">
            Daftar sebagai karyawan
          </Link>
        </p>
      </div>
    </div>
  );
}
