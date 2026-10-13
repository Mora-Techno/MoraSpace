'use client';

import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'Apa itu Spaces?',
      a: 'Spaces adalah ruang kerja digital kolaboratif yang menggabungkan manajemen tugas, agenda harian, dan catatan kerja tim dalam satu antarmuka yang bersih dan menenangkan mata. Kami mengutamakan ketenangan kerja dan eliminasi distraksi yang kerap ditemui pada perkakas produktivitas konvensional.',
    },
    {
      q: 'Untuk tim seperti apa Spaces dirancang?',
      a: 'Spaces dirancang untuk studio kreatif, software house, agensi digital, tim produk, serta profesional independen yang menghargai ketenangan kerja, fokus mendalam, dan transparansi tim tanpa dibebani notifikasi tak berujung.',
    },
    {
      q: 'Apa saja fitur inti versi awal?',
      a: 'Fitur inti mencakup manajemen tugas terstruktur, agenda harian personal & tim, catatan kolaboratif, sesi fokus Pomodoro dengan musik ambient, penjadwalan waktu tenang otomatis, serta integrasi peran multi-anggota.',
    },
    {
      q: 'Bagaimana pengaturan waktu tenang bekerja?',
      a: 'Anda dapat menentukan jam operasional studio (misalnya 09.00 - 17.00 WIB). Di luar jam tersebut, notifikasi masuk akan ditahan secara hening dan dihadirkan kembali besok pagi saat tim kembali beraktivitas.',
    },
    {
      q: 'Apakah tersedia tema terang dan gelap?',
      a: 'Tentu! Spaces hadir dengan dua tema kanonik: Botanical Light (kehangatan palet sage dan botanical di siang hari) serta Midnight Calm (ketenangan palet midnight navy dan aksen gold di malam hari).',
    },
    {
      q: 'Apakah asisten AI sudah tersedia?',
      a: 'Asisten AI Mora saat ini berada dalam tahap pengembangan terencana (Kuartal 2 2026) untuk membantu merangkum butir rapat, menyusun draf ide, dan menata agenda harian secara otomatis.',
    },
  ];

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="faq" className="px-4 py-16 md:px-8 md:py-24 border-t border-border/40">
      <div className="mx-auto max-w-4xl space-y-12">
        {/* Header */}
        <div className="text-center space-y-3">
          <span className="font-mono text-xs font-bold tracking-wider text-muted-foreground uppercase">
            PUSAT INFORMASI
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-foreground leading-tight">
            Kenali Spaces lebih dekat.
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            Jawaban untuk hal-hal yang sering ditanyakan sebelum memulai ruang kerjamu.
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={faq.q}
                className="rounded-2xl border border-border/70 bg-card/60 transition-colors overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => toggle(idx)}
                  className="w-full flex items-center justify-between p-5 text-left text-sm sm:text-base font-semibold text-foreground hover:text-primary transition-colors cursor-pointer select-none"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`size-4.5 text-muted-foreground transition-transform duration-200 shrink-0 ml-3 ${
                      isOpen ? 'rotate-180 text-primary' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 text-xs sm:text-sm text-muted-foreground leading-relaxed border-t border-border/30 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
