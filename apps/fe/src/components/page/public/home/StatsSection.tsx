'use client';

import { useGsapStagger } from '@/hooks/useGsapStagger';

const STATS = [
  { value: '30%', label: 'Peningkatan Fokus' },
  { value: '2 Jam', label: 'Waktu Hemat Per Hari' },
  { value: '0', label: 'Context Switching' },
  { value: '100%', label: 'Work-Life Balance' },
];

export function StatsSection() {
  const ref = useGsapStagger<HTMLDivElement>([]);

  return (
    <section className="relative py-16 md:py-24">
      <div className="absolute inset-0 bg-secondary/30 backdrop-blur-md border-y border-border/50" />
      <div ref={ref} className="relative z-10 mx-auto grid max-w-6xl grid-cols-2 gap-10 md:grid-cols-4 px-4 md:px-6">
        {STATS.map((stat) => (
          <div key={stat.label} data-stagger-item className="text-center group cursor-default">
            <p className="bg-clip-text text-transparent bg-gradient-to-br from-primary via-primary to-accent-foreground text-5xl font-black tracking-tighter transition-transform duration-300 group-hover:scale-110 md:text-6xl drop-shadow-sm">
              {stat.value}
            </p>
            <p className="mt-4 text-sm md:text-base font-semibold text-muted-foreground uppercase tracking-wider">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
