'use client';

import type { PickRegisterCompany } from '@repo/types';
import { ArrowRight, AtSign, Building2, Check, Eye, EyeOff, Loader2, User } from 'lucide-react';
import Link from 'next/link';
import type React from 'react';
import { useMemo } from 'react';

import { useTranslation } from '@/pkg/i18n';
import { scorePassword } from '@/utils/password';

interface CompanyRegisterFormSectionProps {
  service: {
    onSubmit: (e: React.FormEvent) => void;
    isPending: boolean;
  };

  state: {
    formRegister: PickRegisterCompany;
    setFormRegister: React.Dispatch<React.SetStateAction<PickRegisterCompany>>;
    showPassword: boolean;
    setShowPassword: React.Dispatch<React.SetStateAction<boolean>>;
  };
}

const CompanyRegisterFormSection: React.FC<CompanyRegisterFormSectionProps> = ({
  service,
  state,
}) => {
  const { t } = useTranslation('auth');
  const { isPending, onSubmit } = service;
  const { formRegister, setFormRegister, showPassword, setShowPassword } = state;

  const password = formRegister.password || '';

  // Password criteria verification (checklist tampilan)
  const hasMinLength = password.length >= 8;
  const hasUpperLower = /[a-z]/.test(password) && /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);

  const passwordStrength = useMemo(() => {
    const score = scorePassword(password);
    if (!password) return { label: t('register.strength_empty'), color: 'text-muted-foreground' };
    if (score <= 1) return { label: t('register.strength_weak'), color: 'text-destructive' };
    if (score === 2) return { label: t('register.strength_medium'), color: 'text-amber-500' };
    return { label: t('register.strength_strong'), color: 'text-primary' };
  }, [password, t]);

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {/* Full Name */}
      <div className="space-y-1.5">
        <label htmlFor="fullName" className="text-sm font-medium text-foreground block">
          {t('register.fullname_label')}
        </label>
        <div className="relative flex items-center">
          <input
            id="fullName"
            type="text"
            value={formRegister.fullName}
            onChange={(e) =>
              setFormRegister((prev) => ({
                ...prev,
                fullName: e.target.value,
              }))
            }
            required
            placeholder={t('register.fullname_placeholder')}
            className="w-full rounded-xl border border-input bg-muted/40 px-3.5 py-3 pr-10 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none transition-all focus:border-ring focus:ring-2 focus:ring-ring/20"
          />
          <div className="absolute right-3.5 flex items-center justify-center text-muted-foreground pointer-events-none">
            <User className="size-4" />
          </div>
        </div>
      </div>

      {/* Company Name */}
      <div className="space-y-1.5">
        <label htmlFor="companyName" className="text-sm font-medium text-foreground block">
          {t('register.company_name_label')}
        </label>
        <div className="relative flex items-center">
          <input
            id="companyName"
            type="text"
            value={formRegister.companyName}
            onChange={(e) =>
              setFormRegister((prev) => ({
                ...prev,
                companyName: e.target.value,
              }))
            }
            required
            placeholder={t('register.company_name_placeholder')}
            className="w-full rounded-xl border border-input bg-muted/40 px-3.5 py-3 pr-10 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none transition-all focus:border-ring focus:ring-2 focus:ring-ring/20"
          />
          <div className="absolute right-3.5 flex items-center justify-center text-muted-foreground pointer-events-none">
            <Building2 className="size-4" />
          </div>
        </div>
      </div>

      {/* Work Email */}
      <div className="space-y-1.5">
        <label htmlFor="email" className="text-sm font-medium text-foreground block">
          {t('register.email_label')}
        </label>
        <div className="relative flex items-center">
          <input
            id="email"
            type="email"
            value={formRegister.email}
            onChange={(e) =>
              setFormRegister((prev) => ({
                ...prev,
                email: e.target.value,
              }))
            }
            required
            placeholder={t('register.email_placeholder')}
            className="w-full rounded-xl border border-input bg-muted/40 px-3.5 py-3 pr-10 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none transition-all focus:border-ring focus:ring-2 focus:ring-ring/20"
          />
          <div className="absolute right-3.5 flex items-center justify-center text-muted-foreground pointer-events-none">
            <AtSign className="size-4" />
          </div>
        </div>
      </div>

      {/* Password with Strength & Criteria */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label htmlFor="password" className="text-sm font-medium text-foreground">
            {t('register.password_label')}
          </label>
          {password.length > 0 && (
            <span className={`text-xs font-semibold ${passwordStrength.color}`}>
              {t('register.strength')}: {passwordStrength.label}
            </span>
          )}
        </div>
        <div className="relative flex items-center">
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            value={formRegister.password}
            onChange={(e) =>
              setFormRegister((prev) => ({
                ...prev,
                password: e.target.value,
              }))
            }
            required
            placeholder={t('register.password_placeholder')}
            className="w-full rounded-xl border border-input bg-muted/40 px-3.5 py-3 pr-10 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none transition-all focus:border-ring focus:ring-2 focus:ring-ring/20"
          />
          <button
            type="button"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3.5 flex items-center justify-center text-muted-foreground transition-colors hover:text-foreground cursor-pointer"
          >
            {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        </div>

        {/* Security Criteria Checklist matching auth-style.png */}
        <div className="space-y-1.5 pt-2 text-xs">
          <p className="font-semibold tracking-wider uppercase text-[11px] text-muted-foreground">
            {t('register.criteria_title')}
          </p>
          <div className="space-y-1 text-muted-foreground">
            <div className="flex items-center gap-2">
              <span
                className={`flex size-3.5 items-center justify-center rounded-full border transition-colors ${
                  hasMinLength
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-muted-foreground/40 bg-transparent'
                }`}
              >
                {hasMinLength && <Check className="size-2.5 stroke-[3]" />}
              </span>
              <span className={hasMinLength ? 'text-foreground font-medium' : ''}>
                {t('register.criteria_min')}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span
                className={`flex size-3.5 items-center justify-center rounded-full border transition-colors ${
                  hasUpperLower
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-muted-foreground/40 bg-transparent'
                }`}
              >
                {hasUpperLower && <Check className="size-2.5 stroke-[3]" />}
              </span>
              <span className={hasUpperLower ? 'text-foreground font-medium' : ''}>
                {t('register.criteria_case')}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span
                className={`flex size-3.5 items-center justify-center rounded-full border transition-colors ${
                  hasNumber
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-muted-foreground/40 bg-transparent'
                }`}
              >
                {hasNumber && <Check className="size-2.5 stroke-[3]" />}
              </span>
              <span className={hasNumber ? 'text-foreground font-medium' : ''}>
                {t('register.criteria_num')}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isPending}
        className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary py-3.5 px-4 font-semibold text-primary-foreground shadow-sm transition-all duration-200 hover:opacity-90 active:scale-[0.99] disabled:opacity-50 cursor-pointer mt-2"
      >
        {isPending ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            <span>{t('register.submitting')}</span>
          </>
        ) : (
          <>
            <span>{t('register.submit_btn')}</span>
            <ArrowRight className="size-4" />
          </>
        )}
      </button>

      {/* Terms disclaimer matching auth-style.png */}
      <p className="text-center text-xs text-muted-foreground leading-relaxed pt-1">
        {t('register.terms_agree')}{' '}
        <Link href="/terms" className="underline hover:text-foreground">
          {t('register.terms')}
        </Link>{' '}
        {t('register.and')}{' '}
        <Link href="/privacy" className="underline hover:text-foreground">
          {t('register.privacy')}
        </Link>
        .
      </p>
    </form>
  );
};

export default CompanyRegisterFormSection;
