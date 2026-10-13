'use client';

import { gsap } from 'gsap';
import { Compass, FileText, Zap } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useRef } from 'react';

export function CollaborationSection() {
  const orbitRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!orbitRef.current) return;

    const ctx = gsap.context(() => {
      // Smoothly rotate the orbital ring
      gsap.to(orbitRef.current, {
        rotation: 360,
        duration: 35,
        repeat: -1,
        ease: 'none',
      });

      // Counter-rotate each floating card so text and icons stay upright
      gsap.to('.orbit-node-inner', {
        rotation: -360,
        duration: 35,
        repeat: -1,
        ease: 'none',
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="cara-kerja"
      className="px-4 py-16 md:px-8 md:py-24 border-t border-border/40 overflow-hidden"
    >
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-12 lg:gap-12">
          {/* Left Column: Spinning Orbital Animation Canvas */}
          <div className="lg:col-span-6 flex items-center justify-center py-8">
            <div className="relative size-80 sm:size-[420px] flex items-center justify-center">
              {/* Central Spaces Hub */}
              <div className="relative z-20 flex size-20 sm:size-24 flex-col items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/20">
                <Image
                  src="/images/logo.png"
                  alt="Spaces Logo"
                  width={30}
                  height={30}
                  className="rounded-full aspect-square"
                />
                <span className="text-[11px] font-bold tracking-tight mt-0.5">Spaces</span>
              </div>

              {/* Static Background Concentric Subtle Rings */}
              <div className="absolute inset-4 rounded-full border border-dashed border-border/40 pointer-events-none" />
              <div className="absolute inset-16 rounded-full border border-border/20 pointer-events-none" />

              {/* Rotating Orbit Container */}
              <div ref={orbitRef} className="absolute inset-0 size-full pointer-events-none">
                {/* Dashed Spin Line (SVG Circular Track) */}
                <svg
                  className="absolute inset-0 size-full"
                  viewBox="0 0 420 420"
                  fill="none"
                  role="img"
                  aria-label="Garis Orbit Kolaborasi"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <title>Garis Orbit Kolaborasi</title>
                  <circle
                    cx="210"
                    cy="210"
                    r="190"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeDasharray="6 8"
                    className="text-primary/40 dark:text-primary/30"
                  />
                </svg>

                {/* Node 1 (Top Left): Sarah N. Memperbarui Moodboard */}
                <div className="absolute top-[8%] left-[8%] -translate-x-1/2 -translate-y-1/2 pointer-events-auto">
                  <div className="orbit-node-inner flex items-center gap-2 rounded-2xl border border-border/80 bg-card/90 px-3 py-1.5 shadow-md backdrop-blur-md">
                    <span className="flex size-6 items-center justify-center rounded-full bg-destructive/15 text-[10px] font-bold text-destructive">
                      SN
                    </span>
                    <div className="text-left text-[11px] leading-tight">
                      <p className="font-bold text-foreground">Sarah N.</p>
                      <p className="text-[10px] text-muted-foreground">Memperbarui Moodboard</p>
                    </div>
                  </div>
                </div>

                {/* Node 2 (Top Right): Dimas P. Dalam Waktu Fokus */}
                <div className="absolute top-[8%] right-[8%] translate-x-1/2 -translate-y-1/2 pointer-events-auto">
                  <div className="orbit-node-inner flex items-center gap-2 rounded-2xl border border-border/80 bg-card/90 px-3 py-1.5 shadow-md backdrop-blur-md">
                    <span className="flex size-6 items-center justify-center rounded-full bg-primary/20 text-[10px] font-bold text-primary">
                      DP
                    </span>
                    <div className="text-left text-[11px] leading-tight">
                      <p className="font-bold text-foreground">Dimas P.</p>
                      <p className="text-[10px] text-muted-foreground">Dalam Waktu Fokus</p>
                    </div>
                  </div>
                </div>

                {/* Node 3 (Bottom Left): Catatan Brief Q4.md */}
                <div className="absolute bottom-[8%] left-[8%] -translate-x-1/2 translate-y-1/2 pointer-events-auto">
                  <div className="orbit-node-inner flex items-center gap-2 rounded-2xl border border-border/80 bg-card/90 px-3 py-1.5 shadow-md backdrop-blur-md">
                    <FileText className="size-4 text-primary" />
                    <span className="text-[11px] font-semibold text-foreground">
                      Catatan Brief Q4.md
                    </span>
                  </div>
                </div>

                {/* Node 4 (Bottom Right): Sprint Retrospektif */}
                <div className="absolute bottom-[8%] right-[8%] translate-x-1/2 translate-y-1/2 pointer-events-auto">
                  <div className="orbit-node-inner flex items-center gap-2 rounded-2xl border border-border/80 bg-card/90 px-3 py-1.5 shadow-md backdrop-blur-md">
                    <Zap className="size-4 text-accent-foreground" />
                    <span className="text-[11px] font-semibold text-foreground">
                      Sprint Retrospektif
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Text & Features */}
          <div className="lg:col-span-6 space-y-6">
            <span className="font-mono text-xs font-bold tracking-wider text-muted-foreground uppercase">
              02 — KOLABORASI KONTEKSTUAL
            </span>

            <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-foreground leading-tight">
              Bergerak bersama, dengan konteks yang sama.
            </h2>

            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              Hubungkan anggota, tim, dan catatan kerja dalam satu ruang yang mudah dipahami. Tanpa
              utas obrolan yang tenggelam atau dokumen terpisah di lima tab peramban berbeda.
            </p>

            {/* Feature Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3">
              {/* Card 1 */}
              <div className="rounded-2xl border border-border/60 bg-card/70 p-4.5 space-y-2 backdrop-blur-xs">
                <div className="flex size-8 items-center justify-center rounded-xl bg-primary/15 text-primary">
                  <Compass className="size-4.5" />
                </div>
                <h4 className="font-bold text-sm text-foreground">Ruang Tim Mandiri</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Setiap departemen memiliki oasis tersendiri namun tetap terhubung ke tujuan utama
                  studio.
                </p>
              </div>

              {/* Card 2 */}
              <div className="rounded-2xl border border-border/60 bg-card/70 p-4.5 space-y-2 backdrop-blur-xs">
                <div className="flex size-8 items-center justify-center rounded-xl bg-secondary/25 text-foreground">
                  <FileText className="size-4.5" />
                </div>
                <h4 className="font-bold text-sm text-foreground">Catatan Terintegrasi</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Tautkan keputusan rapat langsung ke lembar tugas sehingga riwayat ide tidak pernah
                  hilang.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
