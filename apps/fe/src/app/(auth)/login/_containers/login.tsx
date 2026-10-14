'use client';

import { useGoogleLogin } from '@react-oauth/google';
import type { PickLogin } from '@repo/types';
import Link from 'next/link';
import { useState } from 'react';

import GoogleSignInButton from '@/components/molecules/GoogleSignButton';
import { LoginFormSection } from '@/components/page/auth';
import { useApi } from '@/hooks/useApi/useApi';
import { useTranslation } from '@/pkg/i18n';

export default function LoginContainer() {
  const api = useApi();
  const { t } = useTranslation('auth');
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
          {t('login.title', { defaultValue: 'Selamat datang kembali' })}
        </h1>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {t('login.subtitle', {
            defaultValue: 'Masuk untuk melanjutkan ke ruang kerja Spaces Anda.',
          })}
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
          {t('login.or_continue_with', { defaultValue: 'atau' })}
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
          {t('login.no_account', { defaultValue: 'Belum punya akun?' })}{' '}
          <Link href="/register/company" className="font-semibold text-primary hover:underline">
            {t('login.register_now', { defaultValue: 'Daftar sekarang' })}
          </Link>
        </p>
        <p className="text-xs text-muted-foreground">
          {t('login.register_personal', { defaultValue: 'Mau coba sendiri dulu?' })}{' '}
          <Link href="/register/individual" className="font-medium text-foreground hover:underline">
            {t('login.register_personal_link', { defaultValue: 'Daftar sebagai personal' })}
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
