'use client';

export function AudienceStrip() {
  const audiences = ['Startup', 'Software House', 'Digital Agency', 'Creative Studio'];

  return (
    <section className="px-4 py-16 md:px-8 md:py-20 border-t border-border/40 text-center">
      <div className="mx-auto max-w-4xl space-y-6">
        <h3 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          Untuk tim yang membangun sesuatu.
        </h3>

        {/* Tags Row */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
          {audiences.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-border/70 bg-card/70 px-5 py-2 text-xs sm:text-sm font-semibold text-foreground shadow-2xs backdrop-blur-xs"
            >
              {tag}
            </span>
          ))}
        </div>

        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-lg mx-auto">
          Bebas dari beban fitur yang berlebihan. Hanya apa yang esensial untuk melahirkan karya
          berharga.
        </p>
      </div>
    </section>
  );
}
