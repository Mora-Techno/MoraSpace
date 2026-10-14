'use client';

import { Clock, Link2, Sparkles } from 'lucide-react';

import { useTranslation } from '@/pkg/i18n';

export function StepsSection() {
  const { t } = useTranslation('public');

  const steps = [
    {
      num: '01',
      title: t('steps.step1_title'),
      desc: t('steps.step1_desc'),
      footer: t('steps.step1_footer'),
      icon: Clock,
      featured: false,
    },
    {
      num: '02',
      title: t('steps.step2_title'),
      desc: t('steps.step2_desc'),
      footer: t('steps.step2_footer'),
      icon: Link2,
      featured: true,
    },
    {
      num: '03',
      title: t('steps.step3_title'),
      desc: t('steps.step3_desc'),
      footer: t('steps.step3_footer'),
      icon: Sparkles,
      featured: false,
    },
  ];

  return (
    <section id="untuk-tim" className="px-4 py-16 md:px-8 md:py-24 border-t border-border/40">
      <div className="mx-auto max-w-7xl">
        {/* Centered Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
          <span className="font-mono text-xs font-bold tracking-wider text-muted-foreground uppercase">
            {t('steps.tag')}
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-foreground leading-tight">
            {t('steps.title')}
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            {t('steps.desc')}
          </p>
        </div>

        {/* 3 Step Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.num}
                className={`relative rounded-3xl border p-7 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 ${
                  step.featured
                    ? 'border-primary/60 bg-card shadow-lg shadow-primary/5'
                    : 'border-border/60 bg-card/60'
                }`}
              >
                {step.featured && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-0.5 text-[10px] font-bold tracking-wider text-primary-foreground uppercase shadow-xs">
                    {t('steps.badge_rec')}
                  </div>
                )}

                <div className="space-y-4">
                  <div
                    className={`flex size-11 items-center justify-center rounded-2xl text-base font-bold ${
                      step.featured
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {step.num}
                  </div>

                  <h3 className="font-bold text-lg text-foreground">{step.title}</h3>

                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    {step.desc}
                  </p>
                </div>

                <div className="pt-8 border-t border-border/40 mt-6 flex items-center gap-2 text-xs text-muted-foreground font-medium">
                  <Icon className="size-3.5 text-primary" />
                  <span>{step.footer}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
