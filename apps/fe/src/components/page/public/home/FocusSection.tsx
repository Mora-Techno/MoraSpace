'use client';

import { BellOff, Clock, Music2, Pause, Play, RotateCcw, SkipForward, Volume2 } from 'lucide-react';
import { useEffect, useState } from 'react';

export function FocusSection() {
  const [secondsLeft, setSecondsLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [activeSound, setActiveSound] = useState('Hutan Pinus');

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, secondsLeft]);

  const toggleTimer = () => setIsRunning(!isRunning);
  const resetTimer = () => {
    setIsRunning(false);
    setSecondsLeft(25 * 60);
  };

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const timeFormatted = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  return (
    <section className="px-4 py-16 md:px-8 md:py-24 border-t border-border/40">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-12">
          {/* Left Column: Description & Features */}
          <div className="lg:col-span-5 space-y-6">
            <span className="font-mono text-xs font-bold tracking-wider text-muted-foreground uppercase">
              04 — SESI FOKUS TERKURASI
            </span>

            <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-foreground leading-tight">
              Beri perhatian pada yang penting.
            </h2>

            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              Gunakan Pomodoro, musik latar instrumental yang menenangkan, dan catatan ringkas untuk
              menemani sesi kerja yang lebih fokus dan terhindar dari distraksi digital.
            </p>

            {/* Checklist Bullets */}
            <div className="space-y-3.5 pt-2 text-xs sm:text-sm text-foreground/90">
              <div className="flex items-start gap-3">
                <Music2 className="size-4.5 text-primary shrink-0 mt-0.5" />
                <span>Playlist ambient terkurasi (Lofi, Kicau Hutan, Hujan Lembut)</span>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="size-4.5 text-primary shrink-0 mt-0.5" />
                <span>Pewaktu Pomodoro 25/5 menit dengan dering hening</span>
              </div>
              <div className="flex items-start gap-3">
                <BellOff className="size-4.5 text-primary shrink-0 mt-0.5" />
                <span>Sembunyikan semua badge notifikasi selama sesi berlangsung</span>
              </div>
            </div>
          </div>

          {/* Right Column: Pomodoro Widget Card */}
          <div className="lg:col-span-7">
            <div className="rounded-3xl border border-border/70 bg-card/85 backdrop-blur-md text-foreground p-7 sm:p-9 shadow-lg shadow-black/5 dark:shadow-black/20 max-w-lg mx-auto space-y-7">
              {/* Card Header */}
              <div className="flex items-center justify-between border-b border-border/40 pb-4 text-xs font-semibold">
                <div className="flex items-center gap-2">
                  <span className="size-2 rounded-full bg-primary" />
                  <span>Ruang Fokus Pribadi</span>
                </div>
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Volume2 className="size-3.5 text-primary" />
                  <span className="text-[11px] font-mono">Ambient Audio</span>
                </div>
              </div>

              {/* Circular Progress Ring */}
              <div className="flex flex-col items-center justify-center py-2">
                <div className="relative flex size-52 sm:size-60 items-center justify-center rounded-full border-4 border-primary/20 bg-card/60 shadow-inner">
                  {/* Subtle Accent Glow Ring */}
                  <div
                    className={`absolute inset-0 rounded-full border-4 border-primary transition-all duration-1000 ${
                      isRunning ? 'opacity-100' : 'opacity-40'
                    }`}
                    style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)' }}
                  />

                  <div className="text-center space-y-1">
                    <span className="font-mono text-4xl sm:text-5xl font-extrabold tracking-tight text-foreground">
                      {timeFormatted}
                    </span>
                    <p className="text-[11px] font-bold tracking-wider text-muted-foreground uppercase">
                      SESI MENDALAM #2
                    </p>
                  </div>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center justify-center gap-4">
                <button
                  type="button"
                  onClick={resetTimer}
                  className="flex size-10 items-center justify-center rounded-full border border-border/70 bg-card text-muted-foreground hover:text-foreground transition-all active:scale-95 cursor-pointer"
                  title="Reset Pomodoro"
                >
                  <RotateCcw className="size-4" />
                </button>

                <button
                  type="button"
                  onClick={toggleTimer}
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:opacity-90 active:scale-98 cursor-pointer"
                >
                  {isRunning ? (
                    <>
                      <Pause className="size-4" />
                      <span>Jeda Sesi</span>
                    </>
                  ) : (
                    <>
                      <Play className="size-4 fill-primary-foreground" />
                      <span>Mulai Sesi</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={resetTimer}
                  className="flex size-10 items-center justify-center rounded-full border border-border/70 bg-card text-muted-foreground hover:text-foreground transition-all active:scale-95 cursor-pointer"
                  title="Lewati Sesi"
                >
                  <SkipForward className="size-4" />
                </button>
              </div>

              {/* Ambient Sound Pills */}
              <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                {[
                  { name: 'Hutan Pinus', icon: '🌲' },
                  { name: 'Hujan Sore', icon: '🌧' },
                  { name: 'Kafe Teduh', icon: '☕' },
                ].map((s) => (
                  <button
                    key={s.name}
                    type="button"
                    onClick={() => setActiveSound(s.name)}
                    className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                      activeSound === s.name
                        ? 'bg-primary text-primary-foreground shadow-xs'
                        : 'border border-border/70 bg-card/60 text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <span>{s.icon}</span>
                    <span>{s.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
