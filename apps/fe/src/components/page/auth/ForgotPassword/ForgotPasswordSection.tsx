'use client';

import type { PickSendMagicLink } from '@repo/types';
import { ArrowRight, AtSign, Loader2 } from 'lucide-react';
import Link from 'next/link';
import type React from 'react';

interface ForgotPasswordSectionProps {
  service: {
    onForgotPassword: (e: React.FormEvent) => void;
    isPending: boolean;
  };
  state: {
    formSendMagicLink: PickSendMagicLink;
    setFormSendMagicLink: React.Dispatch<React.SetStateAction<PickSendMagicLink>>;
  };
}

const ForgotPasswordSection: React.FC<ForgotPasswordSectionProps> = ({ service, state }) => {
  const { formSendMagicLink, setFormSendMagicLink } = state;
  const { onForgotPassword, isPending } = service;

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Lupa kata sandi?
        </h1>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Masukkan email kerja Anda dan kami akan mengirimkan instruksi untuk mengatur ulang kata
          sandi.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={onForgotPassword} className="space-y-4.5">
        <div className="space-y-1.5">
          <label htmlFor="email" className="text-sm font-medium text-foreground block">
            Email kerja
          </label>
          <div className="relative flex items-center">
            <input
              id="email"
              type="email"
              value={formSendMagicLink.email}
              onChange={(e) =>
                setFormSendMagicLink((prev) => ({
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

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isPending}
          className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary py-3 px-4 font-semibold text-primary-foreground shadow-sm transition-all duration-200 hover:opacity-90 active:scale-[0.99] disabled:opacity-50 cursor-pointer"
        >
          {isPending ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              <span>Memproses...</span>
            </>
          ) : (
            <>
              <span>Kirim tautan reset</span>
              <ArrowRight className="size-4" />
            </>
          )}
        </button>

        {/* Back to Login */}
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

export default ForgotPasswordSection;
