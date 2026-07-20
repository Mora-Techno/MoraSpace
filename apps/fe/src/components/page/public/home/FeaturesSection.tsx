'use client';

import { CalendarDays, CheckCircle2, Headphones, Bot, Zap } from 'lucide-react';
import { useGsapStagger } from '@/hooks/useGsapStagger';

const FEATURES = [
  {
    icon: CheckCircle2,
    title: 'Manajemen Tugas Terpusat',
    description: 'Kelola Todo, prioritaskan pekerjaan, dan lacak progres dengan antarmuka yang bersih dan bebas gangguan.',
  },
  {
    icon: Bot,
    title: 'Asisten AI Cerdas',
    description: 'Rangkum hasil meeting, buat tugas otomatis, dan temukan informasi penting dalam hitungan detik.',
  },
  {
    icon: CalendarDays,
    title: 'Kalender & Jadwal Terintegrasi',
    description: 'Sinkronkan semua event, atur waktu luang, dan jadwalkan pertemuan tanpa harus pindah aplikasi.',
  },
  {
    icon: Headphones,
    title: 'Sesi Fokus & Musik',
    description: 'Tingkatkan konsentrasi dengan Pomodoro timer dan playlist khusus untuk deep work.',
  },
];

export function FeaturesSection() {
  const ref = useGsapStagger<HTMLDivElement>([]);

  return (
    <section className="px-4 py-24 md:px-6 md:py-32 relative">
      <div className="mx-auto max-w-6xl relative z-10">
        <div className="mb-20 text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-sm font-semibold text-primary">
            <Zap className="size-4" />
            Fitur Utama
          </div>
          <h2 className="font-serif text-4xl font-bold text-foreground md:text-5xl tracking-tight">
            Semua yang Tim Anda Butuhkan
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
            Satu platform OS kerja terintegrasi — dirancang khusus untuk mengurangi context-switching dan menghargai jam kerja Anda.
          </p>
        </div>

        <div ref={ref} className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((feature) => {
            const Icon = feature.icon;
            return (
               <div
                key={feature.title}
                data-stagger-item
                className="group relative overflow-hidden rounded-3xl border border-border/50 bg-card/40 p-8 transition-all duration-500 hover:-translate-y-2 hover:border-primary/50 hover:bg-card/80 hover:shadow-2xl hover:shadow-primary/10 backdrop-blur-sm"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                <div className="relative z-10">
                  <div className="mb-6 flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3">
                    <Icon className="size-7" strokeWidth={1.5} />
                  </div>
                  <h3 className="mb-3 text-xl font-bold text-foreground">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
