'use client';

import { ArrowDown, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export function BottomCtaSection() {
  return (
    <section className="px-4 pb-20 pt-8 md:px-8 md:pb-28">
      <div className="mx-auto max-w-5xl">
        <div className="relative overflow-hidden rounded-[2.5rem] border border-border/70 bg-[#FAF7F2] dark:bg-[#1E2938] p-10 sm:p-16 md:p-20 text-center shadow-lg shadow-black/5 dark:shadow-black/20">
          {/* Subtle Organic Background Blob */}
          <div className="pointer-events-none absolute -right-20 -bottom-20 size-80 rounded-full bg-primary/10 blur-3xl" />
          <div className="pointer-events-none absolute -left-20 -top-20 size-80 rounded-full bg-secondary/15 blur-3xl" />

          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            {/* Top Icon Badge */}
            <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-sm">
              <ArrowDown className="size-5" />
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground leading-tight">
              Mulai ruang kerja yang lebih terarah.
            </h2>

            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-lg mx-auto">
              Bergabunglah dengan ratusan tim yang telah beralih ke cara bekerja yang tenang,
              terstruktur, dan berkesinambungan.
            </p>

            {/* Buttons Row */}
            <div className="flex flex-wrap items-center justify-center gap-3.5 pt-2">
              <Link
                href="/register/company"
                className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:opacity-90 active:scale-98"
              >
                <span>Buat ruang kerja</span>
                <ArrowRight className="size-4" />
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center justify-center rounded-full border border-border/80 bg-card/60 px-7 py-3.5 text-sm font-semibold text-foreground transition-all hover:bg-muted/80"
              >
                Masuk
              </Link>
            </div>

            <p className="text-xs text-muted-foreground pt-2">
              Gratis uji coba 14 hari penuh • Tidak membutuhkan kartu kredit
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
