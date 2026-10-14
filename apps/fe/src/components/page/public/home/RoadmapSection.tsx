'use client';

import { Bot, Calendar, MessageSquare, Sparkles } from 'lucide-react';

import { useTranslation } from '@/pkg/i18n';

export function RoadmapSection() {
  const { t } = useTranslation('public');

  const roadmapItems = [
    {
      title: t('roadmap.item1_title'),
      desc: t('roadmap.item1_desc'),
      quarter: t('roadmap.item1_q'),
      icon: MessageSquare,
    },
    {
      title: t('roadmap.item2_title'),
      desc: t('roadmap.item2_desc'),
      quarter: t('roadmap.item2_q'),
      icon: Sparkles,
    },
    {
      title: t('roadmap.item3_title'),
      desc: t('roadmap.item3_desc'),
      quarter: t('roadmap.item3_q'),
      icon: Bot,
    },
    {
      title: t('roadmap.item4_title'),
      desc: t('roadmap.item4_desc'),
      quarter: t('roadmap.item4_q'),
      icon: Calendar,
    },
  ];

  return (
    <section className="px-4 py-16 md:px-8 md:py-24 border-t border-border/40">
      <div className="mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-14">
          <span className="font-mono text-xs font-bold tracking-wider text-muted-foreground uppercase">
            {t('roadmap.tag')}
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-foreground leading-tight">
            {t('roadmap.title')}
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            {t('roadmap.desc')}
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {roadmapItems.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="rounded-3xl border border-border/60 bg-card/60 p-6 flex flex-col justify-between space-y-5 transition-all duration-300 hover:border-primary/40 hover:-translate-y-1"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex size-9 items-center justify-center rounded-xl bg-primary/15 text-primary">
                      <Icon className="size-4.5" />
                    </div>
                    <span className="rounded-full bg-muted px-2.5 py-0.5 text-[10px] font-semibold text-muted-foreground">
                      {t('roadmap.planned')}
                    </span>
                  </div>

                  <h3 className="font-bold text-base text-foreground">{item.title}</h3>

                  <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>

                <div className="pt-4 border-t border-border/40 text-[11px] font-mono text-muted-foreground font-semibold">
                  {item.quarter}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
