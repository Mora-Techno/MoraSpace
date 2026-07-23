'use client';

import { CheckCircle2, X, Zap, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { Button, Badge } from '@/components/atoms';

interface PricingSectionSection {
  template: {
    title: string;
    desc: string;
  };
}

const PLANS = [
  {
    name: 'Starter',
    description: 'Sempurna untuk individu yang ingin mengatur pekerjaan mereka.',
    price: 'Gratis',
    period: 'selamanya',
    features: [
      'Manajemen Tugas (Todo) & Kalender Dasar',
      'Catatan Pribadi (Notes)',
      'Pomodoro Timer & Fokus Dasar',
      'Integrasi 1 Perangkat',
    ],
    missing: ['Asisten AI Cerdas', 'Analitik Produktivitas', 'Kolaborasi Tim', 'Dukungan Prioritas'],
    cta: 'Mulai Gratis',
    href: '/register',
    popular: false,
  },
  {
    name: 'Pro',
    description: 'Untuk profesional dan tim kecil yang membutuhkan asisten pintar.',
    price: 'Rp 99.000',
    period: '/ bulan',
    features: [
      'Semua fitur di Starter',
      'Asisten AI (Chat, Ringkasan, Auto-Task)',
      'Sinkronisasi Google Calendar & Drive',
      'Musik Fokus (Playlist Premium)',
      'Dashboard Analitik Personal',
      'Kolaborasi hingga 10 Anggota',
    ],
    missing: ['Manajemen Organisasi Lanjut', 'SSO & Keamanan Tingkat Lanjut'],
    cta: 'Coba Pro 14 Hari',
    href: '/register?plan=pro',
    popular: true,
  },
  {
    name: 'Enterprise',
    description: 'Sistem operasi lengkap untuk skala perusahaan dengan kustomisasi penuh.',
    price: 'Kustom',
    period: 'hubungi kami',
    features: [
      'Semua fitur di Pro (Tanpa Batas Anggota)',
      'Manajemen Struktur Perusahaan & Role',
      'Dashboard & Analitik Tim / Perusahaan',
      'SSO, SCIM, & Audit Log',
      'API Access & Kustomisasi Integrasi',
      'Dedicated Account Manager',
    ],
    missing: [],
    cta: 'Hubungi Sales',
    href: '/contact',
    popular: false,
  },
];

const PricingSection: React.FC<PricingSectionSection> = () => {
  return (
    <section className="relative px-4 pb-32 pt-24 md:px-6 md:pt-32 min-h-screen">
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden">
        <div className="absolute left-1/2 top-0 -translate-x-1/2 h-[500px] w-[800px] rounded-full bg-primary/10 blur-[120px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl">
        <div className="mb-16 text-center">
          <Badge className="mb-6 backdrop-blur-md bg-primary/10 border-primary/20 text-primary py-1.5 px-4 inline-flex items-center gap-2 rounded-full">
            <Zap className="size-4" />
            Harga Transparan
          </Badge>
          <h1 className="font-serif text-4xl font-extrabold text-foreground md:text-6xl tracking-tight">
            Investasi untuk <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent-foreground">Produktivitas Sehat</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
            Satu langganan untuk menggantikan puluhan aplikasi. Spaces dirancang untuk membantu Anda fokus pada pekerjaan, bukan pada alatnya.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {PLANS.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-[2rem] border p-8 transition-all duration-300 hover:scale-[1.02] backdrop-blur-xl ${
                plan.popular
                  ? 'border-primary/50 bg-card/60 shadow-2xl shadow-primary/10'
                  : 'border-border/50 bg-card/30'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-primary to-accent-foreground px-4 py-1 text-xs font-bold text-primary-foreground shadow-lg">
                  <Sparkles className="size-3.5 inline mr-1" />
                  Paling Diminati
                </div>
              )}

              <h3 className="text-2xl font-bold text-foreground">{plan.name}</h3>
              <p className="mt-2 text-sm text-muted-foreground h-10">{plan.description}</p>
              
              <div className="mt-6 mb-8">
                <span className="text-4xl font-black text-foreground">{plan.price}</span>
                <span className="text-muted-foreground"> {plan.period}</span>
              </div>

              <Button
                asChild
                className={`w-full rounded-xl py-6 font-semibold shadow-md transition-all duration-300 ${
                  plan.popular
                    ? 'bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-primary/20'
                    : 'bg-secondary/50 text-foreground hover:bg-secondary border border-border/50'
                }`}
              >
                <Link href={plan.href}>{plan.cta}</Link>
              </Button>

              <div className="mt-8 space-y-4">
                <p className="text-sm font-semibold text-foreground">Termasuk:</p>
                <ul className="space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3 text-sm text-muted-foreground">
                      <CheckCircle2 className="size-5 text-primary shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                  {plan.missing.map((feature) => (
                    <li key={feature} className="flex items-start gap-3 text-sm text-muted-foreground/50 opacity-60">
                      <X className="size-5 shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
