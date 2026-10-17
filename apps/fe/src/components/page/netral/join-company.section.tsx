'use client';

import type { ICompanyJoinPreview } from '@repo/types/company.types';
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  KeyRound,
  Loader2,
  LogIn,
  QrCode,
  ShieldAlert,
  UserPlus,
  Users,
} from 'lucide-react';
import Image from 'next/image';
import React from 'react';

import { Button, Input, Label } from '@/components/atoms';
import { GhibliCard } from '@/components/molecules/GhibliCard';
import { LanguageDropdown } from '@/core/components/language.dropdown';

export interface JoinCompanySectionProps {
  template: {
    title: string;
    subtitle: string;
  };
  service: {
    preview?: ICompanyJoinPreview | null;
    isPreviewLoading: boolean;
    previewError?: unknown;
    isLoggedIn: boolean;
    isPending: boolean;
    onJoin: () => void;
    onLogin: () => void;
    onRegister: () => void;
    onBack: () => void;
  };
  state: {
    code: string;
    setCode: (code: string) => void;
  };
}

export const JoinCompanySection: React.FC<JoinCompanySectionProps> = ({
  template,
  service,
  state,
}) => {
  const { title, subtitle } = template;
  const {
    preview,
    isPreviewLoading,
    previewError,
    isLoggedIn,
    isPending,
    onJoin,
    onLogin,
    onRegister,
    onBack,
  } = service;
  const { code, setCode } = state;

  const hasValidCode = code.trim().length >= 6;
  const errorMessage =
    previewError && typeof previewError === 'object' && 'message' in previewError
      ? String((previewError as any).message)
      : previewError
        ? 'Kode tidak valid atau perusahaan tidak aktif'
        : null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasValidCode || isPending || isPreviewLoading) return;
    if (!isLoggedIn) {
      onLogin();
      return;
    }
    onJoin();
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center p-4 w-full">
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6">
        <LanguageDropdown />
      </div>

      <GhibliCard className="w-full max-w-md p-6 sm:p-8" hover={false}>
        {/* Brand Header */}
        <div className="mb-6 flex flex-col items-center gap-2 text-center">
          <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-xs">
            <QrCode className="size-7" />
          </div>
          <h1 className="font-serif text-2xl font-bold tracking-tight text-foreground">{title}</h1>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-xs">{subtitle}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Input Code */}
          <div className="space-y-2">
            <Label htmlFor="joinCodeInput" className="text-xs font-semibold text-muted-foreground">
              Kode Undangan Perusahaan
            </Label>
            <div className="relative">
              <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                id="joinCodeInput"
                type="text"
                autoFocus
                maxLength={12}
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ''))}
                placeholder="Contoh: 7K9M2P4X"
                disabled={isPending}
                className="pl-10 font-mono text-base tracking-widest uppercase font-semibold h-12 rounded-xl bg-background/80 border-border/80 focus:ring-2 focus:ring-primary/20"
              />
              {isPreviewLoading && (
                <div className="absolute right-3.5 top-1/2 -translate-y-1/2">
                  <Loader2 className="size-4 animate-spin text-primary" />
                </div>
              )}
            </div>
          </div>

          {/* Error Message */}
          {errorMessage && hasValidCode && !isPreviewLoading && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-xs text-destructive">
              <ShieldAlert className="size-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Company Preview Card */}
          {preview && !isPreviewLoading && (
            <div className="flex items-center gap-3.5 p-3.5 rounded-xl bg-primary/5 border border-primary/20 transition-all animate-in fade-in zoom-in-95">
              <div className="flex size-12 items-center justify-center rounded-xl bg-background border border-border/60 shrink-0 overflow-hidden shadow-xs">
                {preview.logo ? (
                  <Image
                    src={preview.logo}
                    alt={preview.name}
                    width={48}
                    height={48}
                    className="size-full object-cover"
                  />
                ) : (
                  <Building2 className="size-6 text-primary" />
                )}
              </div>
              <div className="flex flex-1 flex-col overflow-hidden">
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold text-sm truncate text-foreground">
                    {preview.name}
                  </span>
                  <CheckCircle2 className="size-3.5 text-emerald-500 shrink-0" />
                </div>
                <div className="flex items-center gap-2 text-[11px] text-muted-foreground mt-0.5">
                  <span className="flex items-center gap-1">
                    <Users className="size-3 text-muted-foreground" />
                    {preview.memberCount} anggota
                  </span>
                  <span>•</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                    Perusahaan Aktif
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-2 pt-2">
            {isLoggedIn ? (
              <Button
                type="submit"
                disabled={!hasValidCode || isPending || isPreviewLoading || Boolean(errorMessage)}
                className="w-full h-11 rounded-xl text-sm font-medium gap-2 shadow-sm"
              >
                {isPending ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Sedang Bergabung...
                  </>
                ) : (
                  <>
                    Gabung ke Perusahaan
                    <ArrowRight className="size-4" />
                  </>
                )}
              </Button>
            ) : (
              <div className="space-y-2">
                <Button
                  type="button"
                  onClick={onLogin}
                  disabled={!hasValidCode || isPreviewLoading || Boolean(errorMessage)}
                  className="w-full h-11 rounded-xl text-sm font-medium gap-2 shadow-sm"
                >
                  <LogIn className="size-4" />
                  Masuk untuk Bergabung
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={onRegister}
                  className="w-full h-10 rounded-xl text-xs font-medium gap-2"
                >
                  <UserPlus className="size-3.5" />
                  Belum punya akun? Daftar
                </Button>
              </div>
            )}

            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onBack}
              disabled={isPending}
              className="w-full text-xs text-muted-foreground hover:text-foreground h-9"
            >
              {isLoggedIn ? 'Kembali ke Dashboard' : 'Kembali ke Halaman Utama'}
            </Button>
          </div>
        </form>
      </GhibliCard>
    </main>
  );
};

export default JoinCompanySection;
