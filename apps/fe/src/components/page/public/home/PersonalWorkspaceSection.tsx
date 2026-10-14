'use client';

import { Check, Moon, Sparkles } from 'lucide-react';

import { useTheme } from '@/core/providers/theme.provider';
import { useTranslation } from '@/pkg/i18n';

export function PersonalWorkspaceSection() {
  const { t } = useTranslation('public');
  const { toggleTheme } = useTheme();

  return (
    <section className="px-4 py-16 md:px-8 md:py-24 border-t border-border/40">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-12">
          {/* Left Column */}
          <div className="lg:col-span-5 space-y-6">
            <span className="font-mono text-xs font-bold tracking-wider text-muted-foreground uppercase">
              {t('workspace.tag')}
            </span>

            <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-foreground leading-tight">
              {t('workspace.title')}
            </h2>

            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              {t('workspace.desc')}
            </p>

            {/* Interactive Theme Switch Button */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-2">
              <button
                type="button"
                onClick={toggleTheme}
                className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:opacity-90 active:scale-98 cursor-pointer"
              >
                <Sparkles className="size-4" />
                <span>{t('workspace.theme_btn')}</span>
              </button>
              <span className="text-xs text-muted-foreground">{t('workspace.theme_hint')}</span>
            </div>
          </div>

          {/* Right Column: Stacked Dual Theme Cards */}
          <div className="lg:col-span-7 relative py-4">
            {/* Top Light Card (Botanical Light) */}
            <div className="rounded-3xl border border-[#94A3B8]/30 bg-[#FAF7F2] text-[#4A4238] p-5 sm:p-6 shadow-md max-w-lg mx-auto space-y-4">
              <div className="flex items-center justify-between border-b border-[#94A3B8]/20 pb-3 text-xs">
                <div className="flex items-center gap-2 font-bold">
                  <span className="size-2 rounded-full bg-[#7DAF74]" />
                  <span>{t('workspace.light_title')}</span>
                </div>
                <span className="rounded-full bg-[#E8F4E6] px-2 py-0.5 text-[10px] font-bold text-[#3F6637]">
                  {t('workspace.day_badge')}
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between rounded-xl bg-white/70 p-3 shadow-2xs">
                  <div className="flex items-center gap-2.5">
                    <span className="flex size-3.5 items-center justify-center rounded bg-[#7DAF74] text-white">
                      <Check className="size-2.5 stroke-[3]" />
                    </span>
                    <span className="font-medium text-[#4A4238]">{t('workspace.task1_title')}</span>
                  </div>
                  <span className="text-[11px] text-[#4A4238]/70">{t('workspace.task1_time')}</span>
                </div>

                <div className="flex items-center justify-between rounded-xl bg-white/70 p-3 shadow-2xs">
                  <div className="flex items-center gap-2.5">
                    <span className="size-3.5 rounded border border-[#94A3B8]/40" />
                    <span className="font-medium text-[#4A4238]">{t('workspace.task2_title')}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Dark Card (Midnight Calm) - Overlapping */}
            <div className="sm:-mt-8 mt-4 rounded-3xl border border-white/10 bg-[#1A2530] text-[#E8E6E1] p-5 sm:p-6 shadow-xl max-w-md ml-auto mr-4 space-y-3 relative z-10">
              <div className="flex items-center justify-between border-b border-white/10 pb-3 text-xs">
                <div className="flex items-center gap-2 font-bold text-[#F2C94C]">
                  <span className="size-2 rounded-full bg-[#F2C94C]" />
                  <span>{t('workspace.dark_title')}</span>
                </div>
                <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-bold text-[#E8E6E1]">
                  {t('workspace.night_badge')}
                </span>
              </div>

              <div className="flex items-center justify-between rounded-xl bg-[#243040] p-3 text-xs">
                <span className="font-medium text-[#E8E6E1]">{t('workspace.quiet_mode')}</span>
                <Moon className="size-4 text-[#F2C94C]" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
