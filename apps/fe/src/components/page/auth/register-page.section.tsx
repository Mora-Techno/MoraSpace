'use client';

import Link from 'next/link';
import type { ReactNode } from 'react';

import GoogleSignInButton from '@/components/molecules/GoogleSignButton';
import { useTranslation } from '@/pkg/i18n';

interface RegisterPageSectionProps {
  template: {
    title: string;
    subtitle: string;
    altPrompt: string;
    altHref: string;
    altLink: string;
  };
  service: {
    onGoogleLogin: () => void;
    form: ReactNode;
  };
}

export function RegisterPageSection({ template, service }: RegisterPageSectionProps) {
  const { t } = useTranslation('auth');
  const { title, subtitle, altPrompt, altHref, altLink } = template;
  const { onGoogleLogin, form } = service;

  return (
    <div className="w-full space-y-6">
      {/* Form Header */}
      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">{title}</h1>
        <p className="text-sm text-muted-foreground leading-relaxed">{subtitle}</p>
      </div>

      {/* Main Registration Form */}
      {form}

      {/* Divider */}
      <div className="relative flex items-center justify-center my-4">
        <div className="w-full border-t border-border/60" />
        <span className="absolute bg-background px-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
          {t('register.or')}
        </span>
      </div>

      {/* Social Registration */}
      <div className="w-full">
        <GoogleSignInButton
          onSuccess={onGoogleLogin}
          disabled={false}
          className="rounded-xl border-border/70 bg-card/60 hover:bg-muted font-medium text-sm py-2.5"
        />
      </div>

      {/* Account Switching Links */}
      <div className="space-y-2 pt-2 text-center text-sm">
        <p className="text-muted-foreground">
          {t('register.have_account')}{' '}
          <Link href="/login" className="font-semibold text-primary hover:underline">
            {t('register.login_now')}
          </Link>
        </p>
        <p className="text-xs text-muted-foreground">
          {altPrompt}{' '}
          <Link href={altHref} className="font-medium text-foreground hover:underline">
            {altLink}
          </Link>
        </p>
      </div>
    </div>
  );
}

export default RegisterPageSection;
