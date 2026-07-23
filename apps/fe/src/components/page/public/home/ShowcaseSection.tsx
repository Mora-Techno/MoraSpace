'use client';

import { ArrowUpRight, Clock, Sparkles } from 'lucide-react';
import Link from 'next/link';

import { Badge } from '@/components/atoms';
import { useGsapStagger } from '@/hooks/useGsapStagger';

const WORKFLOWS = [
  {
    category: 'Kolaborasi',
    title: 'Mengelola Proyek Bersama dengan Lebih Tenang',
    excerpt: 'Transparansi tanpa notifikasi berlebihan. Semua informasi mudah ditemukan.',
    date: 'Mode Kerja',
    gradient: 'from-primary/40 to-secondary/60',
  },
  {
    category: 'Produktivitas',
    title: 'Mode Fokus & Pomodoro Terintegrasi',
    excerpt: 'Blokir gangguan dan mainkan musik ambient untuk sesi deep work yang maksimal.',
    date: 'Fokus',
    gradient: 'from-secondary/50 to-accent/50',
  },
  {
    category: 'AI Assistant',
    title: 'Otomatisasi Catatan dan Ringkasan Rapat',
    excerpt: 'Biarkan AI merangkum diskusi dan membuat tugas secara otomatis dari kalender Anda.',
    date: 'Asisten',
    gradient: 'from-accent/40 to-primary/30',
  },
];

export function ShowcaseSection() {
  const ref = useGsapStagger<HTMLDivElement>([]);

  return (
    <section className="px-4 py-24 md:px-6 md:py-32">
      <div className="mx-auto max-w-6xl">
        <div className="mb-16 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <h2 className="font-serif text-4xl font-bold text-foreground md:text-5xl tracking-tight">
              Alur Kerja yang Human-Centered
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Teknologi seharusnya membantu manusia bekerja lebih baik, bukan membuat pekerjaan menjadi lebih rumit.
            </p>
          </div>
          <Link
            href="/login"
            className="group inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-6 py-3 text-sm font-semibold text-primary transition-all duration-300 hover:bg-primary/10 hover:border-primary/40"
          >
            Lihat Semua Fitur 
            <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
          </Link>
        </div>

        <div ref={ref} className="grid gap-8 md:grid-cols-3">
          {WORKFLOWS.map((workflow) => (
            <article
              key={workflow.title}
              data-stagger-item
              className="group overflow-hidden rounded-3xl border border-border/60 bg-card/30 backdrop-blur-md transition-all duration-500 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1"
            >
              <div className={`relative flex h-56 items-start justify-end bg-gradient-to-br ${workflow.gradient} p-6 overflow-hidden`}>
                <div className="absolute inset-0 bg-black/5 dark:bg-black/20 mix-blend-overlay transition-opacity group-hover:opacity-0" />
                <Badge className="relative z-10 border-white/20 bg-background/50 text-foreground backdrop-blur-md px-3 py-1 shadow-sm">
                  <Sparkles className="size-3.5 mr-1.5 inline" />
                  {workflow.category}
                </Badge>
              </div>
              <div className="p-8">
                <h3 className="font-serif text-2xl font-bold leading-tight text-foreground transition-colors duration-300 group-hover:text-primary">
                  {workflow.title}
                </h3>
                <p className="mt-4 text-base text-muted-foreground leading-relaxed">{workflow.excerpt}</p>
                <div className="mt-6 flex items-center gap-2 text-sm font-medium text-primary">
                  <Clock className="size-4" />
                  {workflow.date}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
