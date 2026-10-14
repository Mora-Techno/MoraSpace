'use client';

import { ArrowRight, Check, CheckSquare } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

import { useTranslation } from '@/pkg/i18n';

export function WorkflowSection() {
  const { t } = useTranslation('public');

  const [subtasks, setSubtasks] = useState([
    { id: 1, textKey: 'workflow.subtask1', done: true },
    { id: 2, textKey: 'workflow.subtask2', done: true },
    { id: 3, textKey: 'workflow.subtask3', done: false },
  ]);

  const toggleSubtask = (id: number) => {
    setSubtasks((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  };

  return (
    <section id="fitur" className="px-4 py-16 md:px-8 md:py-24 border-t border-border/40">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-12">
          {/* Left Column: Description & Features */}
          <div className="lg:col-span-5 space-y-6">
            <span className="font-mono text-xs font-bold tracking-wider text-muted-foreground uppercase">
              {t('workflow.tag')}
            </span>

            <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-foreground leading-tight">
              {t('workflow.title_line1')}
              <br />
              {t('workflow.title_line2')}
            </h2>

            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              {t('workflow.desc')}
            </p>

            {/* Checklist Points */}
            <div className="space-y-4 pt-2">
              <div className="flex items-start gap-3">
                <div className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary mt-0.5">
                  <Check className="size-3 stroke-[3]" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-foreground">
                    {t('workflow.point1_title')}
                  </h4>
                  <p className="text-xs text-muted-foreground leading-relaxed mt-0.5">
                    {t('workflow.point1_desc')}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary mt-0.5">
                  <Check className="size-3 stroke-[3]" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-foreground">
                    {t('workflow.point2_title')}
                  </h4>
                  <p className="text-xs text-muted-foreground leading-relaxed mt-0.5">
                    {t('workflow.point2_desc')}
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <Link
                href="/register/company"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
              >
                <span>{t('workflow.cta')}</span>
                <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>

          {/* Right Column: Sprint Task Card Mockup */}
          <div className="lg:col-span-7">
            <div className="rounded-3xl border border-border/70 bg-card p-6 shadow-lg shadow-black/5 dark:shadow-black/20 space-y-4">
              {/* Card Header */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/40 pb-4">
                <div className="flex items-center gap-2">
                  <div className="flex size-6 items-center justify-center rounded-full bg-primary/20 text-primary">
                    <CheckSquare className="size-3.5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-foreground">
                      {t('workflow.mockup_sprint')}
                    </h4>
                    <p className="text-[11px] text-muted-foreground">
                      {t('workflow.mockup_progress')}
                    </p>
                  </div>
                </div>
                <span className="rounded-full bg-muted px-2.5 py-1 text-[11px] font-semibold text-muted-foreground">
                  {t('workflow.mockup_badge')}
                </span>
              </div>

              {/* Expanded Primary Task */}
              <div className="rounded-2xl border border-border/70 bg-background/80 p-4.5 space-y-3.5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <span className="flex size-4 items-center justify-center rounded-md bg-primary text-primary-foreground">
                      <Check className="size-3 stroke-[3]" />
                    </span>
                    <span className="font-bold text-sm text-foreground">
                      {t('workflow.task_primary_title')}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px]">
                    <span className="rounded-md bg-destructive/15 px-2 py-0.5 font-bold text-destructive">
                      {t('workflow.priority_high')}
                    </span>
                    <span className="rounded-md bg-muted px-2 py-0.5 font-medium text-muted-foreground">
                      {t('workflow.yesterday')}
                    </span>
                  </div>
                </div>

                {/* Subtask Checkboxes */}
                <div className="space-y-2 pl-6 text-xs">
                  {subtasks.map((task) => (
                    <button
                      type="button"
                      key={task.id}
                      onClick={() => toggleSubtask(task.id)}
                      className="flex w-full items-center gap-2.5 cursor-pointer select-none text-left text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <span
                        className={`flex size-3.5 shrink-0 items-center justify-center rounded border transition-colors ${
                          task.done
                            ? 'border-primary bg-primary text-primary-foreground'
                            : 'border-muted-foreground/40 bg-transparent'
                        }`}
                      >
                        {task.done && <Check className="size-2.5 stroke-[3]" />}
                      </span>
                      <span
                        className={
                          task.done ? 'line-through text-muted-foreground/70' : 'text-foreground'
                        }
                      >
                        {t(task.textKey as any)}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Task Row 2 */}
              <div className="flex items-center justify-between rounded-xl border border-border/40 bg-card/60 p-3 text-xs">
                <div className="flex items-center gap-2.5">
                  <span className="size-3.5 rounded border border-muted-foreground/40" />
                  <span className="font-medium text-foreground">{t('workflow.task2_title')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="rounded-md bg-secondary/20 px-2 py-0.5 text-[10px] font-semibold text-foreground">
                    {t('workflow.task2_priority')}
                  </span>
                  <span className="text-[11px] text-muted-foreground">
                    {t('workflow.task2_time')}
                  </span>
                  <span className="size-5 rounded-full bg-primary/20 flex items-center justify-center font-bold text-[9px] text-primary">
                    MK
                  </span>
                </div>
              </div>

              {/* Task Row 3 */}
              <div className="flex items-center justify-between rounded-xl border border-border/40 bg-card/60 p-3 text-xs">
                <div className="flex items-center gap-2.5">
                  <span className="size-3.5 rounded-border border border-muted-foreground/40" />
                  <span className="font-medium text-foreground">{t('workflow.task3_title')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="rounded-md bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                    {t('workflow.task3_priority')}
                  </span>
                  <span className="text-[11px] text-muted-foreground">
                    {t('workflow.task3_time')}
                  </span>
                  <span className="size-5 rounded-full bg-secondary/30 flex items-center justify-center font-bold text-[9px] text-foreground">
                    DS
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
