'use client';

import type { PickResetPassword } from '@repo/types';
import { ArrowRight, Check, Eye, EyeOff, Loader2 } from 'lucide-react';
import Link from 'next/link';
import type React from 'react';
import { useMemo } from 'react';

import { scorePassword } from '@/utils/password';

interface ResetPasswordSectionProps {
  service: {
    onResetPassword: (e: React.FormEvent) => void;
    isPending: boolean;
  };
  state: {
    formResetPassword: PickResetPassword;
    setFormResetPassword: React.Dispatch<React.SetStateAction<PickResetPassword>>;
    confirmPassword: string;
    setConfirmPassword: React.Dispatch<React.SetStateAction<string>>;
    passwordStrength: { score: number; label: string; color: string };
    showPassword: boolean;
    setShowPassword: React.Dispatch<React.SetStateAction<boolean>>;
    showConfirmPassword: boolean;
    setShowConfirmPassword: React.Dispatch<React.SetStateAction<boolean>>;
  };
}

const ResetPasswordSection: React.FC<ResetPasswordSectionProps> = ({ service, state }) => {
  const {
    formResetPassword,
    setFormResetPassword,
    confirmPassword,
    setConfirmPassword,
    showPassword,
    setShowPassword,
    showConfirmPassword,
    setShowConfirmPassword,
  } = state;
  const { onResetPassword, isPending } = service;

  const password = formResetPassword.password || '';

  // Password criteria verification
  const hasMinLength = password.length >= 8;
  const hasUpperLower = /[a-z]/.test(password) && /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);

  const strength = useMemo(() => {
    if (!password) return { label: 'Kosong', color: 'text-muted-foreground' };
    const score = scorePassword(password);

    if (score <= 1) return { label: 'Lemah', color: 'text-destructive' };
    if (score === 2) return { label: 'Sedang', color: 'text-amber-500' };
    return { label: 'Kuat', color: 'text-primary' };
  }, [password]);

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Atur kata sandi baru
        </h1>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Buat kata sandi baru yang aman untuk akun Spaces Anda.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={onResetPassword} className="space-y-4.5">
        {/* New Password */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label htmlFor="password" className="text-sm font-medium text-foreground">
              Kata sandi baru
            </label>
            {password.length > 0 && (
              <span className={`text-xs font-semibold ${strength.color}`}>
                Kekuatan: {strength.label}
              </span>
            )}
          </div>
          <div className="relative flex items-center">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={formResetPassword.password}
              onChange={(e) =>
                setFormResetPassword((prev) => ({
                  ...prev,
                  password: e.target.value,
                }))
              }
              required
              placeholder="Masukkan kata sandi baru"
              className="w-full rounded-xl border border-input bg-muted/40 px-3.5 py-3 pr-10 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none transition-all focus:border-ring focus:ring-2 focus:ring-ring/20"
            />
            <button
              type="button"
              aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 flex items-center justify-center text-muted-foreground transition-colors hover:text-foreground cursor-pointer"
            >
              {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>

          {/* Security Criteria Checklist */}
          <div className="space-y-1.5 pt-2 text-xs">
            <p className="font-semibold tracking-wider uppercase text-[11px] text-muted-foreground">
              KRITERIA KEAMANAN:
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
                  Minimal 8 karakter
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
                  Mengandung huruf besar dan huruf kecil
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
                  Mengandung angka (simbol opsional)
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Confirm Password */}
        <div className="space-y-1.5">
          <label htmlFor="confirmPassword" className="text-sm font-medium text-foreground block">
            Konfirmasi kata sandi
          </label>
          <div className="relative flex items-center">
            <input
              id="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              placeholder="Ketik ulang kata sandi baru"
              className="w-full rounded-xl border border-input bg-muted/40 px-3.5 py-3 pr-10 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none transition-all focus:border-ring focus:ring-2 focus:ring-ring/20"
            />
            <button
              type="button"
              aria-label={
                showConfirmPassword
                  ? 'Sembunyikan konfirmasi password'
                  : 'Tampilkan konfirmasi password'
              }
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3.5 flex items-center justify-center text-muted-foreground transition-colors hover:text-foreground cursor-pointer"
            >
              {showConfirmPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
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
              <span>Memproses...</span>
            </>
          ) : (
            <>
              <span>Simpan kata sandi baru</span>
              <ArrowRight className="size-4" />
            </>
          )}
        </button>

        {/* Back Link */}
        <div className="pt-2 text-center text-sm">
          <Link
            href="/login"
            className="inline-flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            ← Kembali ke halaman Masuk
          </Link>
        </div>
      </form>
    </div>
  );
};

export default ResetPasswordSection;
