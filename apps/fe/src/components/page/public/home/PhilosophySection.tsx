'use client';

import { BellOff, Clock, ShieldCheck } from 'lucide-react';

import { useTranslation } from '@/pkg/i18n';

export function PhilosophySection() {
  const { t } = useTranslation('public');

  return (
    <section className="px-4 py-16 md:px-8 md:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="rounded-3xl border border-white/10 bg-[#16202A] text-[#E8E6E1] p-8 sm:p-12 lg:p-16 shadow-2xl relative overflow-hidden">
          {/* Subtle Ambient Radial Lighting */}
          <div className="pointer-events-none absolute -left-20 -top-20 size-80 rounded-full bg-[#F2C94C]/10 blur-3xl" />
          <div className="pointer-events-none absolute -right-20 -bottom-20 size-80 rounded-full bg-[#7DAF74]/10 blur-3xl" />

          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-12 relative z-10">
            {/* Left Column: Manifesto & Philosophy */}
            <div className="lg:col-span-6 space-y-6">
              <span className="font-mono text-xs font-bold tracking-wider text-[#F2C94C] uppercase">
                {t('philosophy.tag')}
              </span>

              <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white leading-tight">
                {t('philosophy.title_line1')}
                <br />
                {t('philosophy.title_line2')}
              </h2>

              <p className="text-sm sm:text-base text-[#E8E6E1]/80 leading-relaxed max-w-xl">
                {t('philosophy.desc')}
              </p>

              {/* Feature Badges */}
              <div className="space-y-3 pt-2 text-xs sm:text-sm text-[#E8E6E1]/90">
                <div className="flex items-center gap-3">
                  <div className="flex size-7 items-center justify-center rounded-lg bg-white/10 text-[#F2C94C]">
                    <BellOff className="size-4" />
                  </div>
                  <span>{t('philosophy.point1')}</span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex size-7 items-center justify-center rounded-lg bg-white/10 text-[#7DAF74]">
                    <Clock className="size-4" />
                  </div>
                  <span>{t('philosophy.point2')}</span>
                </div>
              </div>
            </div>

            {/* Right Column: Status Card */}
            <div className="lg:col-span-6">
              <div className="rounded-2xl border border-white/10 bg-[#1F2B37] p-6 shadow-xl space-y-5 max-w-lg mx-auto">
                <div className="flex items-center justify-between border-b border-white/10 pb-4 text-xs">
                  <div className="flex items-center gap-2 font-semibold text-white">
                    <span className="size-2 rounded-full bg-[#F2C94C] animate-pulse" />
                    <span>{t('philosophy.card_title')}</span>
                  </div>
                  <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-[10px] font-bold text-[#F2C94C]">
                    {t('philosophy.card_active')}
                  </span>
                </div>

                {/* Operating Schedule Box */}
                <div className="rounded-xl border border-white/10 bg-[#16202A] p-4 space-y-1">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-[#E8E6E1]/60">
                    {t('philosophy.sched_title')}
                  </span>
                  <p className="text-lg font-bold font-mono text-white">
                    {t('philosophy.sched_time')}
                  </p>
                </div>

                {/* Scheduled Notification Box */}
                <div className="flex items-start gap-3 rounded-xl border border-white/10 bg-[#16202A]/80 p-4 text-xs">
                  <ShieldCheck className="size-5 text-[#7DAF74] shrink-0 mt-0.5" />
                  <div className="space-y-1 leading-relaxed text-[#E8E6E1]/80">
                    <p className="font-bold text-white">{t('philosophy.notif_title')}</p>
                    <p>{t('philosophy.notif_desc')}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
