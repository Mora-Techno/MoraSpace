'use client';

import { ArrowRight, Bell, Calendar, CheckSquare, Clock, FileText, Play } from 'lucide-react';
import Link from 'next/link';

export function HeroSection() {
  return (
    <section className="relative overflow-hidden px-4 pt-8 pb-16 md:px-8 md:pt-14 md:pb-24">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-8">
          {/* Left Column: Headlines & Call to Actions */}
          <div className="lg:col-span-6 space-y-6 lg:pr-4">
            {/* Pill Tag */}
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary">
              <span className="size-1.5 rounded-full bg-primary animate-pulse" />
              <span>Ruang Kerja Kalem & Terpadu</span>
            </div>

            {/* Main Headline with Highlight Pill */}
            <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold leading-[1.12] tracking-tight text-foreground">
              Lebih terarah.
              <br />
              Lebih ringan.
              <br />
              Dalam{' '}
              <span className="inline-block rounded-2xl border border-primary/30 bg-primary/10 px-3 py-0.5 text-primary">
                satu ruang.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-xl">
              Satukan tugas, agenda, dan catatan tim. Spaces membantu pekerjaan tetap terorganisir,
              tanpa mengorbankan waktu untuk diri sendiri.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                href="/register/company"
                className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:opacity-90 active:scale-98"
              >
                <span>Buat ruang kerja</span>
                <ArrowRight className="size-4" />
              </Link>
              <Link
                href="#fitur"
                className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-card/60 px-6 py-3.5 text-sm font-semibold text-foreground transition-all hover:bg-muted/80"
              >
                Pelajari fitur
              </Link>
            </div>

            {/* Social Proof Line */}
            <div className="flex items-center gap-3 pt-4 text-xs text-muted-foreground">
              <div className="flex -space-x-2">
                <span className="flex size-7 items-center justify-center rounded-full bg-primary/20 border border-background text-[10px] font-bold text-primary">
                  RA
                </span>
                <span className="flex size-7 items-center justify-center rounded-full bg-secondary/30 border border-background text-[10px] font-bold text-foreground">
                  DE
                </span>
                <span className="flex size-7 items-center justify-center rounded-full bg-accent-foreground/20 border border-background text-[10px] font-bold text-accent-foreground">
                  MK
                </span>
              </div>
              <span>Dipercaya oleh 420+ studio kreatif & tim digital di Asia Tenggara</span>
            </div>
          </div>

          {/* Right Column: Floating Dashboard Mockup Card */}
          <div className="lg:col-span-6">
            <div className="relative mx-auto w-full max-w-xl rounded-3xl border border-border/70 bg-card/85 text-card-foreground p-5 sm:p-6 shadow-xl shadow-black/5 dark:shadow-black/20 backdrop-blur-md">
              {/* Header Bar of Card */}
              <div className="flex items-center justify-between border-b border-border/50 pb-4 text-xs">
                <div className="flex items-center gap-2">
                  <span className="size-2 rounded-full bg-primary" />
                  <span className="font-semibold text-foreground">
                    Spaces • Studio Nusantara Workspace
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-muted-foreground text-[11px]">
                  <Bell className="size-3.5 text-primary" />
                  <span>Notifikasi mengikuti jam kerja (09.00 - 17.00)</span>
                </div>
              </div>

              {/* Internal Layout: Sidebar + Daily Agenda */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 pt-4">
                {/* Mini Left Sidebar */}
                <div className="sm:col-span-4 space-y-1 text-xs border-b sm:border-b-0 sm:border-r border-border/40 pb-4 sm:pb-0 sm:pr-3">
                  <div className="flex items-center gap-2 rounded-xl bg-primary/15 text-primary font-semibold px-3 py-2">
                    <Calendar className="size-3.5" />
                    <span>Hari ini</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground px-3 py-2 hover:text-foreground">
                    <CheckSquare className="size-3.5" />
                    <span>Semua Tugas</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground px-3 py-2 hover:text-foreground">
                    <FileText className="size-3.5" />
                    <span>Catatan Tim</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground px-3 py-2 hover:text-foreground">
                    <Clock className="size-3.5" />
                    <span>Fokus</span>
                  </div>

                  <div className="pt-6 sm:pt-8 text-[11px] text-muted-foreground">
                    <div className="flex items-center justify-between mb-1.5">
                      <span>Ritme Pekan</span>
                      <span className="font-bold text-foreground">84%</span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                      <div className="h-full w-[84%] rounded-full bg-primary" />
                    </div>
                  </div>
                </div>

                {/* Main Content Area */}
                <div className="sm:col-span-8 space-y-4">
                  {/* Agenda Title + Quick Timer Pill */}
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-sm text-foreground">Agenda Hari Ini</h4>
                      <p className="text-[11px] text-muted-foreground">
                        Selasa, 24 Oktober • 3 prioritas aktif
                      </p>
                    </div>
                    <div className="inline-flex items-center gap-1.5 rounded-full bg-card border border-border/60 px-2.5 py-1 text-xs font-mono font-bold text-foreground shadow-xs">
                      <Play className="size-3 fill-primary text-primary" />
                      <span>25:00</span>
                    </div>
                  </div>

                  {/* Task List Cards */}
                  <div className="space-y-2.5">
                    {/* Task 1 */}
                    <div className="rounded-xl border border-border/60 bg-card p-3 shadow-2xs space-y-1">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="size-1.5 rounded-full bg-primary" />
                          <span className="font-semibold text-xs text-foreground">
                            Review desain onboarding
                          </span>
                        </div>
                        <span className="rounded-md bg-destructive/15 px-1.5 py-0.5 text-[10px] font-bold text-destructive">
                          Tinggi
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-muted-foreground pl-3.5">
                        <span>Studio Product • Figma flow v2.4</span>
                        <span className="size-5 rounded-full bg-primary/20 flex items-center justify-center font-bold text-[9px] text-primary">
                          MK
                        </span>
                      </div>
                    </div>

                    {/* Task 2 */}
                    <div className="rounded-xl border border-border/60 bg-card p-3 shadow-2xs space-y-1">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="size-1.5 rounded-full bg-secondary" />
                          <span className="font-semibold text-xs text-foreground">
                            Sinkronisasi tim produk
                          </span>
                        </div>
                        <span className="rounded-md bg-primary/15 px-1.5 py-0.5 text-[10px] font-bold text-primary">
                          11.00 WIB
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-muted-foreground pl-3.5">
                        <span>Meeting 30 menit • Room Kopi Pagi</span>
                        <span className="size-5 rounded-full bg-secondary/30 flex items-center justify-center font-bold text-[9px] text-foreground">
                          DS
                        </span>
                      </div>
                    </div>

                    {/* Task 3 */}
                    <div className="rounded-xl border border-border/60 bg-card p-3 shadow-2xs space-y-1">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="size-1.5 rounded-full bg-muted-foreground" />
                          <span className="font-semibold text-xs text-foreground">
                            Finalisasi dokumentasi API
                          </span>
                        </div>
                        <span className="rounded-md bg-muted px-1.5 py-0.5 text-[10px] font-semibold text-muted-foreground">
                          Besok
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-muted-foreground pl-3.5">
                        <span>Backend Auth • 4 sub-tugas terbuka</span>
                        <span className="size-5 rounded-full bg-accent-foreground/20 flex items-center justify-center font-bold text-[9px] text-accent-foreground">
                          RA
                        </span>
                      </div>
                    </div>
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
