'use client';

import type { PickLogin } from '@repo/types';
import Link from 'next/link';

import GoogleSignInButton from '@/components/molecules/GoogleSignButton';
import { LoginFormSection } from '@/components/page/auth';
import { useTranslation } from '@/pkg/i18n';

interface LoginPageSectionProps {
  service: {
    isPending: boolean;
    onSubmit: (e: React.FormEvent) => void;
    onGoogleLogin: () => void;
  };
  state: {
    formLogin: PickLogin;
    setFormLogin: React.Dispatch<React.SetStateAction<PickLogin>>;
    showPassword: boolean;
    setShowPassword: React.Dispatch<React.SetStateAction<boolean>>;
  };
}

export function LoginPageSection({ service, state }: LoginPageSectionProps) {
  const { t } = useTranslation('auth');
  const { isPending, onSubmit, onGoogleLogin } = service;
  const { formLogin, setFormLogin, showPassword, setShowPassword } = state;

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
          handleSubmit: onSubmit,
          isPending,
        }}
        state={{
          formLogin,
          setFormLogin,
          setShowPassword,
          showPassword,
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
          onSuccess={onGoogleLogin}
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

export default LoginPageSection;
