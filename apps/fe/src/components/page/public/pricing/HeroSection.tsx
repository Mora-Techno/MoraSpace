'use client';

import { Check, CheckCircle2, CreditCard, HelpCircle, Sparkles, X, Zap } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

import { Badge, Button } from '@/components/atoms';
import {
  ScribbleArrow,
  ScribbleCircle,
  ScribbleSparkle,
  ScribbleUnderline,
} from '@/components/atoms/Scribbles';
import { useTranslation } from '@/pkg/i18n';

export interface PricingSectionProps {
  template?: {
    title?: string;
    desc?: string;
  };
  currentTier?: string;
  mySub?: {
    tier?: string;
    status?: string;
    currentPeriodEnd?: string | Date | null;
    [key: string]: any;
  } | null;
  onSelectPlan?: (tier: string) => void;
  isPrivate?: boolean;
}

export function PricingSection({
  template,
  currentTier,
  mySub,
  onSelectPlan,
  isPrivate = false,
}: PricingSectionProps) {
  const { t } = useTranslation('public');
  const [isAnnual, setIsAnnual] = useState(true);

  const PLANS = [
    {
      name: 'Starter',
      badge: 'Individu',
      description: 'Sempurna untuk pekerja independen yang membutuhkan ritme kerja teratur.',
      monthlyPrice: 'Gratis',
      annualPrice: 'Gratis',
      period: 'selamanya',
      features: [
        'Manajemen Tugas & Kalender Dasar',
        'Catatan Pribadi & Arsip Ringkas',
        'Pomodoro Timer Terkurasi',
        'Sinkronisasi 1 Perangkat',
        'Dukungan Komunitas',
      ],
      missing: [
        'Asisten AI Mora',
        'Analitik Ritme Fokus',
        'Ruang Kerja Kolaborasi Tim',
        'Audit Log & Keamanan Tingkat Lanjut',
      ],
      cta: 'Mulai Gratis',
      href: '/register',
      popular: false,
    },
    {
      name: 'Pro',
      badge: 'Paling Diminati',
      description: 'Untuk profesional dan tim kecil yang butuh ketenangan serta bantuan AI cerdas.',
      monthlyPrice: 'Rp 99.000',
      annualPrice: 'Rp 79.000',
      period: '/ bulan / anggota',
      features: [
        'Semua fitur di Starter',
        'Asisten AI Mora (Chat, Ringkasan, Auto-Task)',
        'Sinkronisasi Google Calendar & Drive',
        'Musik & Audio Fokus Terkurasi',
        'Dashboard Analitik Produktivitas Kalem',
        'Kolaborasi hingga 15 Anggota Tim',
        'Dukungan Prioritas Respons 24 Jam',
      ],
      missing: ['SSO, SCIM & Kustomisasi SLA'],
      cta: 'Coba Pro 14 Hari Bebas Risiko',
      href: '/register?plan=pro',
      popular: true,
    },
    {
      name: 'Enterprise',
      badge: 'Skala Besar',
      description:
        'Sistem operasi lengkap untuk organisasi besar dengan privasi dan kontrol total.',
      monthlyPrice: 'Kustom',
      annualPrice: 'Kustom',
      period: 'hubungi perwakilan kami',
      features: [
        'Semua fitur Pro tanpa batas anggota',
        'Manajemen Multi-Organisasi & Hak Akses',
        'SSO (SAML/Okta), SCIM & Enkripsi Khusus',
        'Audit Log Lengkap & Kepatuhan Data',
        'Integrasi API Kustom & Webhooks',
        'Dedicated Customer Success Partner',
      ],
      missing: [],
      cta: 'Jadwalkan Konsultasi',
      href: '/contact',
      popular: false,
    },
  ];

  const COMPARISON_ROWS = [
    {
      feature: 'Manajemen Tugas & Sprint',
      starter: 'Dasar',
      pro: 'Lengkap',
      ent: 'Kustom & Unlimited',
    },
    {
      feature: 'Kalender & Jadwal Ritme',
      starter: '1 Kalender',
      pro: 'Tak Terbatas',
      ent: 'Tak Terbatas',
    },
    {
      feature: 'Mode Fokus & Ambient Sound',
      starter: '3 Sound',
      pro: 'Koleksi Penuh',
      ent: 'Koleksi Penuh',
    },
    { feature: 'Asisten AI Mora', starter: false, pro: '1.000 prompt / bln', ent: 'Tak Terbatas' },
    {
      feature: 'Kolaborasi Anggota',
      starter: '1 Orang',
      pro: 'Hingga 15 Orang',
      ent: 'Tanpa Batas',
    },
    {
      feature: 'Sinkronisasi Multi-Device',
      starter: '1 Perangkat',
      pro: 'Semua Perangkat',
      ent: 'Semua Perangkat',
    },
    { feature: 'Audit Log & Kontrol Akses', starter: false, pro: false, ent: true },
    { feature: 'SLA Uptime 99.9%', starter: false, pro: true, ent: true },
  ];

  return (
    <section
      className={`relative px-4 pb-28 md:px-8 ${
        isPrivate ? 'pt-4 md:pt-6' : 'pt-24 md:pt-32 min-h-screen'
      }`}
    >
      {/* Background radial glow */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden">
        <div className="absolute left-1/2 top-10 -translate-x-1/2 h-[500px] w-[800px] rounded-full bg-primary/10 blur-[140px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl">
        {/* Header Title Section */}
        <div className="mb-12 text-center">
          <h1 className="font-serif text-3xl font-extrabold text-foreground md:text-5xl tracking-tight relative inline-block">
            {template?.title ? (
              template.title
            ) : (
              <>
                {t('pricing.title_prefix', { defaultValue: 'Investasi untuk' })}{' '}
                <span className="relative inline-block text-primary">
                  {t('pricing.title_highlight', { defaultValue: 'Produktivitas Sehat' })}
                  <ScribbleUnderline className="absolute -bottom-4 left-0 w-full text-primary/70" />
                </span>
              </>
            )}
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base md:text-lg text-muted-foreground leading-relaxed">
            {template?.desc ??
              t('pricing.subtitle', {
                defaultValue:
                  'Satu ruang kerja kalem untuk menggantikan puluhan aplikasi yang bising. Tanpa biaya tersembunyi, batalkan kapan saja dengan satu klik.',
              })}
          </p>

          {/* Active Workspace Subscription Status (Private / Billing View) */}
          {isPrivate && mySub && (
            <div className="mt-8 mx-auto max-w-2xl rounded-2xl border border-border/70 bg-card/70 p-4 sm:p-5 backdrop-blur-md flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-left shadow-xs">
              <div className="flex items-center gap-3.5">
                <div className="p-2.5 bg-primary/10 text-primary rounded-xl shrink-0">
                  <CreditCard className="size-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-foreground">
                      Paket Aktif: {mySub?.tier ? String(mySub.tier).toUpperCase() : 'FREE'}
                    </span>
                    <span className="px-2 py-0.5 text-[10px] font-semibold rounded-full bg-success/15 text-success border border-success/25">
                      {mySub?.status ? String(mySub.status).toUpperCase() : 'ACTIVE'}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {mySub?.currentPeriodEnd
                      ? `Berlaku hingga ${new Date(mySub.currentPeriodEnd).toLocaleDateString()}`
                      : 'Nikmati fitur dasar produktivitas Spaces.'}
                  </p>
                </div>
              </div>
              <div className="text-xs text-muted-foreground sm:text-right">
                <span className="inline-block px-2.5 py-1 rounded-lg bg-muted text-muted-foreground font-medium text-[11px]">
                  v0.0.1 Beta Workspace
                </span>
              </div>
            </div>
          )}

          {/* Billing Switcher (Monthly vs Annual) */}
          <div className="mt-8 inline-flex items-center gap-4 relative">
            <div className="flex items-center rounded-full border border-border/70 bg-card/80 p-1 shadow-xs backdrop-blur-md">
              <button
                type="button"
                onClick={() => setIsAnnual(false)}
                className={`rounded-full px-5 py-2 text-xs font-semibold transition-all ${
                  !isAnnual
                    ? 'bg-foreground text-background shadow-xs'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {t('pricing.monthly', { defaultValue: 'Bulanan' })}
              </button>
              <button
                type="button"
                onClick={() => setIsAnnual(true)}
                className={`rounded-full px-5 py-2 text-xs font-semibold transition-all ${
                  isAnnual
                    ? 'bg-foreground text-background shadow-xs'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {t('pricing.annual', { defaultValue: 'Tahunan' })}
              </button>
            </div>

            {/* Hand-drawn savings arrow & note */}
            <div className="hidden sm:flex items-center gap-1.5 text-primary text-xs font-semibold relative">
              <ScribbleArrow className="size-6 text-primary rotate-[-20deg]" />
              <span className="bg-primary/10 border border-primary/20 rounded-full px-2.5 py-1">
                {t('pricing.save_note', { defaultValue: 'Hemat 20% (2 Bulan Gratis)' })}
              </span>
            </div>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid gap-8 lg:grid-cols-3 items-stretch">
          {PLANS.map((plan) => {
            const displayPrice = isAnnual ? plan.annualPrice : plan.monthlyPrice;
            const planTier = plan.name.toLowerCase();
            const isCurrent =
              Boolean(currentTier) &&
              (planTier === currentTier?.toLowerCase() ||
                (planTier === 'starter' && currentTier?.toLowerCase() === 'free'));

            return (
              <div
                key={plan.name}
                className={`relative rounded-3xl border p-8 sm:p-9 flex flex-col justify-between transition-all duration-300 backdrop-blur-xl ${
                  isCurrent
                    ? 'border-primary bg-card/90 shadow-2xl shadow-primary/20 scale-[1.02] z-10 ring-2 ring-primary/30'
                    : plan.popular
                      ? 'border-primary/60 bg-card/90 shadow-2xl shadow-primary/15 scale-[1.02] z-10'
                      : 'border-border/70 bg-card/60 hover:border-border'
                }`}
              >
                {/* Popular or Current Tag */}
                {isCurrent ? (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 rounded-full bg-primary px-4 py-1 text-xs font-bold text-primary-foreground shadow-md">
                    <Check className="size-3.5" />
                    <span>
                      {t('pricing.current_plan_badge', { defaultValue: 'Paket Aktif Saat Ini' })}
                    </span>
                  </div>
                ) : plan.popular ? (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 rounded-full bg-primary px-4 py-1 text-xs font-bold text-primary-foreground shadow-md">
                    <Sparkles className="size-3.5" />
                    <span>{plan.badge}</span>
                    <ScribbleCircle className="absolute -inset-2 size-[120%] text-primary/40 -z-10" />
                  </div>
                ) : null}

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="text-2xl font-bold font-serif text-foreground">{plan.name}</h2>
                    {!plan.popular && !isCurrent && (
                      <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider bg-muted/60 px-2.5 py-0.5 rounded-full">
                        {plan.badge}
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-muted-foreground leading-relaxed min-h-[36px]">
                    {plan.description}
                  </p>

                  {/* Price Tag */}
                  <div className="mt-6 mb-8 pb-6 border-b border-border/50">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-4xl font-extrabold text-foreground tracking-tight">
                        {displayPrice}
                      </span>
                    </div>
                    <span className="text-xs text-muted-foreground mt-1 block">{plan.period}</span>
                  </div>

                  {/* CTA Button */}
                  {isCurrent ? (
                    <Button
                      disabled
                      className="w-full rounded-2xl py-6 font-semibold shadow-sm text-sm bg-muted text-muted-foreground border border-border/50 cursor-default"
                    >
                      {t('pricing.current_plan_btn', { defaultValue: 'Paket Aktif Saat Ini' })}
                    </Button>
                  ) : isPrivate ? (
                    <Button
                      type="button"
                      onClick={() => onSelectPlan?.(planTier === 'starter' ? 'free' : planTier)}
                      disabled={!onSelectPlan}
                      className={`w-full rounded-2xl py-6 font-semibold shadow-sm transition-all duration-200 text-sm ${
                        plan.popular
                          ? 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-primary/20'
                          : 'bg-secondary text-foreground hover:bg-secondary/80 border border-border/70'
                      }`}
                    >
                      {onSelectPlan
                        ? planTier === 'enterprise'
                          ? t('pricing.contact_sales', { defaultValue: 'Hubungi Tim Penjualan' })
                          : t('pricing.choose_plan', { defaultValue: 'Pilih Paket Ini' })
                        : t('pricing.contact_admin', { defaultValue: 'Hubungi Super Admin' })}
                    </Button>
                  ) : (
                    <Button
                      asChild
                      className={`w-full rounded-2xl py-6 font-semibold shadow-sm transition-all duration-200 text-sm ${
                        plan.popular
                          ? 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-primary/20'
                          : 'bg-secondary text-foreground hover:bg-secondary/80 border border-border/70'
                      }`}
                    >
                      <Link href={plan.href}>{plan.cta}</Link>
                    </Button>
                  )}

                  {/* Features List */}
                  <div className="mt-8 space-y-3.5">
                    <p className="text-xs font-bold uppercase tracking-wider text-foreground">
                      Fitur Utama:
                    </p>
                    <ul className="space-y-2.5">
                      {plan.features.map((feature) => (
                        <li
                          key={feature}
                          className="flex items-start gap-3 text-xs text-muted-foreground"
                        >
                          <CheckCircle2 className="size-4 text-primary shrink-0 mt-0.5" />
                          <span className="leading-relaxed">{feature}</span>
                        </li>
                      ))}
                      {plan.missing.map((feature) => (
                        <li
                          key={feature}
                          className="flex items-start gap-3 text-xs text-muted-foreground/45 opacity-60"
                        >
                          <X className="size-4 shrink-0 mt-0.5" />
                          <span className="leading-relaxed line-through">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-8 pt-4 border-t border-border/40 text-[11px] text-muted-foreground text-center">
                  {isCurrent
                    ? 'Paket ruang kerja aktif Anda saat ini.'
                    : plan.popular
                      ? 'Uji coba 14 hari tanpa perlu kartu kredit.'
                      : 'Dapat di-upgrade sewaktu-waktu.'}
                </div>
              </div>
            );
          })}
        </div>

        {/* Feature Comparison Matrix */}
        <div className="mt-28 rounded-3xl border border-border/70 bg-card/60 p-6 sm:p-10 backdrop-blur-md">
          <div className="mb-8 text-center sm:text-left flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="font-serif text-2xl font-bold text-foreground">
                {t('pricing.comparison_title', { defaultValue: 'Perbandingan Rinci Paket' })}
              </h2>
              <p className="text-xs text-muted-foreground mt-1">
                {t('pricing.comparison_subtitle', {
                  defaultValue: 'Pilih kapasitas yang paling sesuai dengan ritme tim kerja Anda.',
                })}
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-primary font-semibold">
              <ScribbleSparkle className="size-4 text-primary" />
              <span>
                {t('pricing.all_plans_update', {
                  defaultValue: 'Semua paket mendapatkan update berkala',
                })}
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-border/60 text-muted-foreground">
                  <th className="pb-4 font-semibold">
                    {t('pricing.feature_col', { defaultValue: 'Fitur / Kapabilitas' })}
                  </th>
                  <th className="pb-4 font-semibold text-center w-28">Starter</th>
                  <th className="pb-4 font-semibold text-center w-28 text-primary">Pro</th>
                  <th className="pb-4 font-semibold text-center w-36">Enterprise</th>
                </tr>
              </thead>
              <tbody className="divide-y border-border/40">
                {COMPARISON_ROWS.map((row) => (
                  <tr key={row.feature} className="hover:bg-muted/30 transition-colors">
                    <td className="py-4 font-medium text-foreground">{row.feature}</td>
                    <td className="py-4 text-center text-muted-foreground">
                      {typeof row.starter === 'boolean' ? (
                        row.starter ? (
                          <Check className="size-4 text-primary mx-auto" />
                        ) : (
                          <span className="text-muted-foreground/40">—</span>
                        )
                      ) : (
                        row.starter
                      )}
                    </td>
                    <td className="py-4 text-center font-semibold text-primary">
                      {typeof row.pro === 'boolean' ? (
                        row.pro ? (
                          <Check className="size-4 text-primary mx-auto" />
                        ) : (
                          <span className="text-muted-foreground/40">—</span>
                        )
                      ) : (
                        row.pro
                      )}
                    </td>
                    <td className="py-4 text-center text-foreground">
                      {typeof row.ent === 'boolean' ? (
                        row.ent ? (
                          <Check className="size-4 text-primary mx-auto" />
                        ) : (
                          <span className="text-muted-foreground/40">—</span>
                        )
                      ) : (
                        row.ent
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pricing FAQ Brief */}
        <div className="mt-20 max-w-3xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 text-primary text-xs font-semibold mb-3">
            <HelpCircle className="size-4" />
            <span>{t('pricing.faq_badge', { defaultValue: 'Pertanyaan Terkait Pembayaran' })}</span>
          </div>
          <h2 className="font-serif text-2xl font-bold text-foreground mb-8">
            {t('pricing.faq_title', { defaultValue: 'Punya pertanyaan sebelum memulai?' })}
          </h2>

          <div className="grid gap-4 sm:grid-cols-2 text-left">
            <div className="rounded-2xl border border-border/60 bg-card/50 p-5 backdrop-blur-sm">
              <h3 className="font-semibold text-xs text-foreground mb-1.5">
                Apakah ada masa percobaan gratis?
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Ya! Paket Pro memiliki masa uji coba gratis 14 hari penuh tanpa komitmen dan tanpa
                kartu kredit.
              </p>
            </div>
            <div className="rounded-2xl border border-border/60 bg-card/50 p-5 backdrop-blur-sm">
              <h3 className="font-semibold text-xs text-foreground mb-1.5">
                Metode pembayaran apa saja yang diterima?
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Kami mendukung QRIS, transfer bank lokal (BCA, Mandiri, BNI), kartu kredit, dan
                e-wallet (GoPay, OVO).
              </p>
            </div>
            <div className="rounded-2xl border border-border/60 bg-card/50 p-5 backdrop-blur-sm">
              <h3 className="font-semibold text-xs text-foreground mb-1.5">
                Bisakah saya membatalkan langganan kapan saja?
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Tentu. Anda dapat membatalkan langganan dengan 1 klik dari menu pengaturan. Data
                Anda tetap tersimpan aman.
              </p>
            </div>
            <div className="rounded-2xl border border-border/60 bg-card/50 p-5 backdrop-blur-sm">
              <h3 className="font-semibold text-xs text-foreground mb-1.5">
                Apakah ada diskon untuk komunitas & edukasi?
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Kami menyediakan potongan harga 50% bagi institusi pendidikan, mahasiswa, dan
                komunitas nirlaba.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default PricingSection;
