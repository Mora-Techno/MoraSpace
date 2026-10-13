'use client';

import type { PickLogin } from '@repo/types';
import { ArrowRight, AtSign, Eye, EyeOff, Loader2 } from 'lucide-react';
import Link from 'next/link';
import type React from 'react';

interface LoginFormSectionProps {
  state: {
    formLogin: PickLogin;
    setFormLogin: React.Dispatch<React.SetStateAction<PickLogin>>;
    showPassword: boolean;
    setShowPassword: React.Dispatch<React.SetStateAction<boolean>>;
  };

  service: {
    handleSubmit: (e: React.FormEvent) => void;
    isPending: boolean;
  };
}

const LoginFormSection: React.FC<LoginFormSectionProps> = ({ state, service }) => {
  const { formLogin, setFormLogin, setShowPassword, showPassword } = state;

  return (
    <form onSubmit={service.handleSubmit} className="space-y-4.5">
      {/* Email Input */}
      <div className="space-y-1.5">
        <label htmlFor="email" className="text-sm font-medium text-foreground block">
          Email kerja
        </label>
        <div className="relative flex items-center">
          <input
            id="email"
            type="email"
            value={formLogin.email}
            onChange={(e) =>
              setFormLogin((prev) => ({
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

      {/* Password Input */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label htmlFor="password" className="text-sm font-medium text-foreground">
            Password
          </label>
          <Link
            href="/forgot-password"
            className="text-xs font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            Lupa kata sandi?
          </Link>
        </div>
        <div className="relative flex items-center">
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            value={formLogin.password}
            onChange={(e) =>
              setFormLogin((prev) => ({
                ...prev,
                password: e.target.value,
              }))
            }
            required
            placeholder="Masukkan password Anda"
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
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={service.isPending}
        className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary py-3 px-4 font-semibold text-primary-foreground shadow-sm transition-all duration-200 hover:opacity-90 active:scale-[0.99] disabled:opacity-50 cursor-pointer"
      >
        {service.isPending ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            <span>Memproses...</span>
          </>
        ) : (
          <>
            <span>Masuk</span>
            <ArrowRight className="size-4" />
          </>
        )}
      </button>
    </form>
  );
};

export default LoginFormSection;
