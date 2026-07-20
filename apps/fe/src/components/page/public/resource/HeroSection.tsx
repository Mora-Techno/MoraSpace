'use client';

import { Book, LifeBuoy, Zap, Shield, FileText, Blocks, Search, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface ResourceHeroSectionProps {
  template: {
    title: string;
    desc: string;
  };
}

const CATEGORIES = [
  {
    title: 'Getting Started',
    desc: 'Pelajari dasar-dasar Spaces, mulai dari pengaturan profil hingga membuat tugas pertama Anda.',
    icon: Zap,
    color: 'text-orange-500',
    bg: 'bg-orange-500/10',
    links: ['Panduan Onboarding', 'Mengundang Tim', 'Pengaturan Workspace'],
  },
  {
    title: 'Tutorial & Fitur',
    desc: 'Panduan mendalam menggunakan Kalender, Mode Fokus, dan Asisten AI secara maksimal.',
    icon: Book,
    color: 'text-primary',
    bg: 'bg-primary/10',
    links: ['Cara Kerja Pomodoro', 'Integrasi Google Calendar', 'Perintah Cepat AI'],
  },
  {
    title: 'API & Integrasi',
    desc: 'Dokumentasi teknis untuk developer yang ingin menghubungkan sistem internal dengan Spaces.',
    icon: Blocks,
    color: 'text-blue-500',
    bg: 'bg-blue-500/10',
    links: ['API Reference', 'Webhooks', 'Membuat Custom Plugin'],
  },
  {
    title: 'Keamanan & Privasi',
    desc: 'Pelajari infrastruktur keamanan Spaces, standar enkripsi, dan kepatuhan privasi data.',
    icon: Shield,
    color: 'text-purple-500',
    bg: 'bg-purple-500/10',
    links: ['Arsitektur Keamanan', 'Konfigurasi SSO', 'Audit Log & Akses'],
  },
];

const ResourceHeroSection: React.FC<ResourceHeroSectionProps> = () => {
  return (
    <section className="relative px-4 pb-32 pt-24 md:px-6 md:pt-32 min-h-screen">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,var(--background),transparent)] z-[-1]" />
      
      <div className="relative z-10 mx-auto max-w-6xl">
        <div className="mb-20 text-center flex flex-col items-center">
          <div className="mb-6 flex size-16 items-center justify-center rounded-2xl bg-secondary/50 text-foreground border border-border/50 shadow-sm">
            <LifeBuoy className="size-8 text-primary" />
          </div>
          <h1 className="font-serif text-4xl font-extrabold text-foreground md:text-6xl tracking-tight">
            Pusat Bantuan & <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent-foreground">Sumber Daya</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
            Temukan jawaban, panduan, dan dokumentasi API untuk membantu Anda memaksimalkan ekosistem Spaces.
          </p>

          <div className="mt-10 flex w-full max-w-2xl items-center gap-3 rounded-full border border-border/50 bg-card/60 p-2 shadow-lg shadow-primary/5 backdrop-blur-xl focus-within:border-primary/50 focus-within:ring-4 focus-within:ring-primary/10">
            <Search className="ml-4 size-5 text-muted-foreground shrink-0" />
            <input
              type="text"
              placeholder="Cari dokumentasi atau panduan..."
              className="flex-1 bg-transparent py-3 text-base text-foreground outline-none placeholder:text-muted-foreground"
            />
            <button className="rounded-full bg-foreground text-background hover:bg-foreground/90 px-8 py-3 text-sm font-semibold transition-all duration-300">
              Cari
            </button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {CATEGORIES.map((category) => {
            const Icon = category.icon;
            return (
              <div key={category.title} className="rounded-[2rem] border border-border/50 bg-card/30 p-8 transition-all duration-300 hover:bg-card/50 hover:border-primary/30 backdrop-blur-sm">
                <div className="flex items-start gap-5">
                  <div className={`flex size-14 items-center justify-center rounded-2xl ${category.bg} ${category.color} shrink-0`}>
                    <Icon className="size-7" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-foreground mb-2">{category.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                      {category.desc}
                    </p>
                    <ul className="space-y-3">
                      {category.links.map((link) => (
                        <li key={link}>
                          <Link href="#" className="group flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary transition-colors duration-300">
                            <FileText className="size-4 text-muted-foreground group-hover:text-primary transition-colors duration-300" />
                            {link}
                          </Link>
                        </li>
                      ))}
                    </ul>
                    <Link href="#" className="inline-flex items-center mt-6 text-sm font-semibold text-primary hover:text-primary/80">
                      Lihat semua artikel <ArrowRight className="ml-1.5 size-4" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ResourceHeroSection;
