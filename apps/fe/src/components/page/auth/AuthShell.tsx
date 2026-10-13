'use client';

import { Moon, Sun } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import type React from 'react';

import { useTheme } from '@/core/providers/theme.provider';

export interface AuthShellProps {
  children: React.ReactNode;
}

export const AuthShell: React.FC<AuthShellProps> = ({ children }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen w-full bg-background text-foreground flex flex-col justify-between selection:bg-primary/20 selection:text-foreground">
      {/* Main Grid: Split Layout */}
      <div className="grid min-h-screen w-full grid-cols-1 lg:grid-cols-2">
        {/* Left Section: Header, Form, and Footer */}
        <div className="flex min-h-screen flex-col justify-between px-6 py-8 sm:px-12 lg:px-16 xl:px-20">
          {/* Top Bar (Brand & Controls) */}
          <div className="flex items-center justify-between pb-6">
            <Link href="/" className="group flex items-center gap-2.5">
              <div className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground font-bold text-sm shadow-sm transition-transform group-hover:scale-105">
                <Image alt='logo' width={40} height={40} src="/images/logo.png"  className='aspect-square rounded-full'/>
              </div>
              <span className="text-xl font-bold tracking-tight text-foreground">Spaces</span>
            </Link>

            {/* Header controls (Visible on mobile, mirrored on right on desktop) */}
            <div className="flex items-center gap-2 lg:hidden">
              <button
                type="button"
                onClick={toggleTheme}
                className="flex size-9 items-center justify-center rounded-xl border border-border/70 bg-card/60 text-foreground transition-colors hover:bg-muted"
                title={
                  theme === 'dark'
                    ? 'Ganti ke mode terang (Warm Botanical)'
                    : 'Ganti ke mode gelap (Midnight Calm)'
                }
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? (
                  <Sun className="size-4 text-primary" />
                ) : (
                  <Moon className="size-4 text-foreground/80" />
                )}
              </button>
              <div className="rounded-xl border border-border/70 bg-card/60 px-2.5 py-1 text-xs font-semibold text-muted-foreground select-none">
                <span className="text-foreground">ID</span>
                <span className="mx-0.5 text-muted-foreground/40">/</span>
                <span>EN</span>
              </div>
            </div>
          </div>

          {/* Form Container */}
          <div className="my-auto w-full max-w-md mx-auto py-6">{children}</div>

          {/* Left Footer */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-border/40 pt-6 text-xs text-muted-foreground">
            <span>Spaces © 2025. Dirancang untuk keheningan dan produktivitas mendalam.</span>
            <div className="flex items-center gap-4">
              <Link
                href="/terms"
                className="transition-colors hover:text-foreground hover:underline"
              >
                Ketentuan
              </Link>
              <Link
                href="/privacy"
                className="transition-colors hover:text-foreground hover:underline"
              >
                Privasi
              </Link>
              <span className="font-mono text-muted-foreground/60">v1.4.0</span>
            </div>
          </div>
        </div>

        {/* Right Section (Section Kanan): Image and Brand Showcase */}
        <div className="hidden lg:flex min-h-screen flex-col justify-between border-l border-border/50 bg-background/50 p-10 xl:p-14 relative overflow-hidden">
          {/* Subtle Ambient Background Accents */}
          <div className="pointer-events-none absolute -right-24 -top-24 size-96 rounded-full bg-primary/10 blur-3xl" />
          <div className="pointer-events-none absolute -left-24 bottom-12 size-96 rounded-full bg-secondary/15 blur-3xl" />

          {/* Top Controls on Desktop */}
          <div className="flex items-center justify-end gap-2.5 z-10">
            <button
              type="button"
              onClick={toggleTheme}
              className="flex size-9 items-center justify-center rounded-xl border border-border/70 bg-card/60 text-foreground transition-colors hover:bg-muted"
              title={
                theme === 'dark'
                  ? 'Ganti ke mode terang (Warm Botanical)'
                  : 'Ganti ke mode gelap (Midnight Calm)'
              }
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <Sun className="size-4 text-primary" />
              ) : (
                <Moon className="size-4 text-foreground/80" />
              )}
            </button>
            <div className="rounded-xl border border-border/70 bg-card/60 px-3 py-1.5 text-xs font-semibold text-muted-foreground select-none">
              <span className="text-foreground">ID</span>
              <span className="mx-1 text-muted-foreground/40">/</span>
              <span>EN</span>
            </div>
          </div>

          {/* Center Showcase Area */}
          <div className="my-auto mx-auto w-full max-w-lg space-y-7 z-10">
            {/* Title & Tagline matching auth-style.png */}
            <div className="space-y-2.5">
              <h2 className="text-3xl xl:text-4xl font-bold tracking-tight text-foreground leading-tight">
                Ruang untuk kerja yang lebih terarah.
              </h2>
              <p className="text-base text-muted-foreground leading-relaxed">
                Satukan agenda, tugas, dan kolaborasi dalam satu ruang.
              </p>
            </div>

            {/* Illustration Display: Theme Adaptive */}
            <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden border border-border/50 shadow-md bg-card/30">
              <Image
                src="/desain/ilustrasion-light.jpg"
                alt="Spaces Workspace Illustration - Mode Terang"
                fill
                className="object-cover dark:hidden"
                sizes="(max-width: 1280px) 45vw, 520px"
                priority
              />
              <Image
                src="/desain/ilustrasion-dark.jpg"
                alt="Spaces Workspace Illustration - Mode Gelap"
                fill
                className="object-cover hidden dark:block"
                sizes="(max-width: 1280px) 45vw, 520px"
                priority
              />
            </div>

            {/* Weekly Agenda Widget matching auth-style.png */}
            <div className="w-full rounded-2xl border border-border/60 bg-card/70 p-4.5 backdrop-blur-md shadow-sm space-y-3.5">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="size-2 rounded-full bg-primary animate-pulse" />
                  <span className="font-semibold text-foreground">Minggu 42 — Agenda Terarah</span>
                </div>
                <span className="rounded-full bg-primary/15 px-2.5 py-0.5 text-[10px] font-bold tracking-wider text-primary">
                  SINKRON
                </span>
              </div>

              {/* Day Pills */}
              <div className="grid grid-cols-4 gap-2 text-center text-xs">
                <div className="rounded-xl bg-muted/40 p-2 border border-border/20">
                  <div className="text-[10px] font-semibold text-muted-foreground uppercase">
                    SEN
                  </div>
                  <div className="text-sm font-bold text-foreground mt-0.5">14</div>
                </div>
                <div className="rounded-xl bg-primary/15 border border-primary/40 p-2">
                  <div className="text-[10px] font-bold text-primary uppercase">SEL</div>
                  <div className="text-sm font-bold text-primary mt-0.5">15</div>
                </div>
                <div className="rounded-xl bg-muted/40 p-2 border border-border/20">
                  <div className="text-[10px] font-semibold text-muted-foreground uppercase">
                    RAB
                  </div>
                  <div className="text-sm font-bold text-foreground mt-0.5">16</div>
                </div>
                <div className="rounded-xl bg-muted/40 p-2 border border-border/20">
                  <div className="text-[10px] font-semibold text-muted-foreground uppercase">
                    KAM
                  </div>
                  <div className="text-sm font-bold text-foreground mt-0.5">17</div>
                </div>
              </div>

              {/* Agenda Task Items */}
              <div className="divide-y divide-border/40 text-xs pt-1">
                <div className="flex items-center justify-between py-2 text-foreground/90">
                  <div className="flex items-center gap-2">
                    <span className="size-1.5 rounded-full bg-primary/70" />
                    <span className="font-medium">Penyusunan kerangka arsitektur sistem</span>
                  </div>
                  <span className="font-mono text-[11px] text-muted-foreground">09:30</span>
                </div>
                <div className="flex items-center justify-between py-2 text-foreground/90">
                  <div className="flex items-center gap-2">
                    <span className="size-1.5 rounded-full bg-secondary/80" />
                    <span className="font-medium">Sinkronisasi ritme tim mingguan</span>
                  </div>
                  <span className="font-mono text-[11px] text-muted-foreground">13:00</span>
                </div>
                <div className="flex items-center justify-between py-2 text-foreground/90">
                  <div className="flex items-center gap-2">
                    <span className="size-1.5 rounded-full bg-primary/60" />
                    <span className="font-medium">Tinjauan rancangan UI & spesifikasi token</span>
                  </div>
                  <span className="font-mono text-[11px] text-muted-foreground">16:15</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Bottom Note */}
          <div className="text-xs text-muted-foreground text-center z-10">
            Harmoni bekerja: Warm Botanical di siang hari, Midnight Calm di malam hari.
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthShell;
