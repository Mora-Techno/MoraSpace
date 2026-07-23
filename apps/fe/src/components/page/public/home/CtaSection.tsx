'use client';

import { ArrowRight, Sparkles } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/atoms';

export function CtaSection() {
  return (
    <section className="px-4 pb-32 pt-16 md:px-6">
      <div className="relative mx-auto max-w-6xl overflow-hidden rounded-[2.5rem] border border-primary/20 bg-card/40 backdrop-blur-xl p-10 md:p-20 text-center shadow-2xl shadow-primary/5">
        <div className="pointer-events-none absolute -left-40 -top-40 size-96 rounded-full bg-primary/20 blur-[120px]" />
        <div className="pointer-events-none absolute -bottom-40 -right-40 size-96 rounded-full bg-secondary/20 blur-[100px]" />

        <div className="relative z-10">
          <div className="mx-auto mb-8 flex size-20 items-center justify-center rounded-3xl bg-gradient-to-br from-primary/20 to-primary/5 text-primary shadow-inner border border-primary/10">
            <Sparkles className="size-10" />
          </div>
          <h2 className="font-serif text-4xl font-extrabold text-foreground md:text-6xl tracking-tight max-w-3xl mx-auto leading-tight">
            Siap Mengubah Cara Tim Anda Bekerja?
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg text-muted-foreground">
            Bergabung dengan Spaces hari ini dan rasakan pengalaman OS digital yang mengutamakan fokus, kolaborasi, dan keseimbangan hidup.
          </p>

          <div className="mx-auto mt-12 flex max-w-md flex-col gap-4 sm:flex-row">
            <input
              type="email"
              placeholder="Masukkan email pekerjaan Anda"
              className="flex-1 rounded-full border border-border/60 bg-background/50 px-6 py-4 text-base text-foreground outline-none placeholder:text-muted-foreground transition-all duration-300 focus:border-primary focus:ring-2 focus:ring-primary/20 backdrop-blur-sm"
            />
            <Button
              asChild
              className="rounded-full bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-7 text-base font-bold shadow-xl shadow-primary/20 transition-all duration-300 hover:scale-105"
            >
              <Link href="/register">
                Mulai Sekarang <ArrowRight className="ml-2 size-5" />
              </Link>
            </Button>
          </div>
          <p className="mt-6 text-sm text-muted-foreground">
            Tanpa kartu kredit. Akses gratis untuk 14 hari pertama.
          </p>
        </div>
      </div>
    </section>
  );
}
