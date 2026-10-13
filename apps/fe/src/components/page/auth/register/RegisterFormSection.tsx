'use client';

import type { PickRegister } from '@repo/types';
import { ArrowRight, AtSign, Check, Eye, EyeOff, Loader2, Phone, User } from 'lucide-react';
import Link from 'next/link';
import type React from 'react';
import { useMemo } from 'react';

interface RegisterFormSectionProps {
  service: {
    onSubmit: (e: React.FormEvent) => void;
    isPending: boolean;
  };

  state: {
    formRegister: PickRegister;
    setFormRegister: React.Dispatch<React.SetStateAction<PickRegister>>;
    showPassword: boolean;
    setShowPassword: React.Dispatch<React.SetStateAction<boolean>>;
  };
}

const RegisterFormSection: React.FC<RegisterFormSectionProps> = ({ service, state }) => {
  const { isPending, onSubmit } = service;
  const { formRegister, setFormRegister, showPassword, setShowPassword } = state;

  const password = formRegister.password || '';

  // Password criteria verification
  const hasMinLength = password.length >= 8;
  const hasUpperLower = /[a-z]/.test(password) && /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);

  const passwordStrength = useMemo(() => {
    if (!password) return { label: 'Kosong', color: 'text-muted-foreground' };
    let score = 0;
    if (hasMinLength) score++;
    if (hasUpperLower) score++;
    if (hasNumber) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (score <= 1) return { label: 'Lemah', color: 'text-destructive' };
    if (score === 2) return { label: 'Sedang', color: 'text-amber-500' };
    return { label: 'Kuat', color: 'text-primary' };
  }, [password, hasMinLength, hasUpperLower, hasNumber]);

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {/* Full Name */}
      <div className="space-y-1.5">
        <label htmlFor="fullName" className="text-sm font-medium text-foreground block">
          Nama lengkap
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
            placeholder="Nama Anda"
            className="w-full rounded-xl border border-input bg-muted/40 px-3.5 py-3 pr-10 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none transition-all focus:border-ring focus:ring-2 focus:ring-ring/20"
          />
          <div className="absolute right-3.5 flex items-center justify-center text-muted-foreground pointer-events-none">
            <User className="size-4" />
          </div>
        </div>
      </div>

      {/* Work Email */}
      <div className="space-y-1.5">
        <label htmlFor="email" className="text-sm font-medium text-foreground block">
          Email kerja
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
            placeholder="nama@perusahaan.com"
            className="w-full rounded-xl border border-input bg-muted/40 px-3.5 py-3 pr-10 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none transition-all focus:border-ring focus:ring-2 focus:ring-ring/20"
          />
          <div className="absolute right-3.5 flex items-center justify-center text-muted-foreground pointer-events-none">
            <AtSign className="size-4" />
          </div>
        </div>
      </div>

      {/* Phone Number */}
      <div className="space-y-1.5">
        <label htmlFor="phone" className="text-sm font-medium text-foreground block">
          Nomor telepon
        </label>
        <div className="relative flex items-center">
          <input
            id="phone"
            type="text"
            value={formRegister.phone || ''}
            onChange={(e) =>
              setFormRegister((prev) => ({
                ...prev,
                phone: e.target.value,
              }))
            }
            required
            placeholder="+62 812 3456 7890"
            className="w-full rounded-xl border border-input bg-muted/40 px-3.5 py-3 pr-10 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none transition-all focus:border-ring focus:ring-2 focus:ring-ring/20"
          />
          <div className="absolute right-3.5 flex items-center justify-center text-muted-foreground pointer-events-none">
            <Phone className="size-4" />
          </div>
        </div>
      </div>

      {/* Password with Strength & Criteria */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label htmlFor="password" className="text-sm font-medium text-foreground">
            Password
          </label>
          {password.length > 0 && (
            <span className={`text-xs font-semibold ${passwordStrength.color}`}>
              Kekuatan: {passwordStrength.label}
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
            placeholder="Buat password aman"
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
            <span>Buat akun karyawan</span>
            <ArrowRight className="size-4" />
          </>
        )}
      </button>

      {/* Terms disclaimer */}
      <p className="text-center text-xs text-muted-foreground leading-relaxed pt-1">
        Dengan membuat akun, kamu menyetujui{' '}
        <Link href="/terms" className="underline hover:text-foreground">
          Ketentuan
        </Link>{' '}
        dan{' '}
        <Link href="/privacy" className="underline hover:text-foreground">
          Kebijakan Privasi
        </Link>
        .
      </p>
    </form>
  );
};

export default RegisterFormSection;
