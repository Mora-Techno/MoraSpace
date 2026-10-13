'use client';

import { Clock, Link2, Sparkles } from 'lucide-react';

export function StepsSection() {
  const steps = [
    {
      num: '01',
      title: 'Buat ruang kerja',
      desc: 'Daftarkan perusahaan atau studio kreatifmu. Susun dasar workspace dengan nama, tema visual awal, dan domain kustom untuk tim.',
      footer: 'Waktu setup < 2 menit',
      icon: Clock,
      featured: false,
    },
    {
      num: '02',
      title: 'Undang tim',
      desc: 'Atur anggota, divisi, dan tingkat akses sesuai kebutuhan. Kirim tautan undangan cepat via email dengan batas hak akses yang aman dan transparan.',
      footer: 'Undang lewat link instan',
      icon: Link2,
      featured: true,
    },
    {
      num: '03',
      title: 'Susun hari kerja',
      desc: 'Mulai kelola tugas, agenda harian, dan waktu fokus. Nikmati alur kerja harian yang jernih tanpa gangguan pesan masuk di luar jam kantor.',
      footer: 'Fokus langsung terjaga',
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
            LANGKAH MUDAH
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-foreground leading-tight">
            Mulai dengan tiga langkah sederhana.
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            Dirancang agar kamu dan tim bisa langsung bekerja dalam hitungan menit, tanpa instalasi
            rumit atau pelatihan berhari-hari.
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
                    DIREKOMENDASIKAN
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
