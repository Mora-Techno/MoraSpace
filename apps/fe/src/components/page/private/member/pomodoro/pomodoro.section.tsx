import { BarChart3, Flame, Pause, Play, Square } from 'lucide-react';
import React from 'react';

import { Button, Card, CardContent } from '@/components/atoms';
import { PageHeader } from '@/components/molecules/PageHeader';

export interface PomodoroSectionProps {
  service: {
    timeLeft: number;
    isRunning: boolean;
    isPaused: boolean;
    handleStart: () => void;
    handlePause: () => void;
    handleResume: () => void;
    handleStop: () => void;
    todayMinutes: number;
    completedSessions: number;
    isPending: boolean;
  };
}

export const PomodoroSection: React.FC<PomodoroSectionProps> = ({
  service: {
    timeLeft,
    isRunning,
    isPaused,
    handleStart,
    handlePause,
    handleResume,
    handleStop,
    todayMinutes,
    completedSessions,
    isPending,
  },
}) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full space-y-6 max-w-4xl mx-auto">
      <PageHeader
        title="Pomodoro Focus"
        description="Fokus bekerja dengan interval terstruktur untuk produktivitas maksimal."
      />

      <Card className="flex flex-col items-center justify-center p-12 text-center shadow-none">
        <div className="relative flex items-center justify-center w-64 h-64 rounded-full border-4 border-neutral-100 dark:border-neutral-800 my-4">
          <span className="text-5xl font-mono font-bold text-neutral-900 dark:text-neutral-100 tracking-wider">
            {formatTime(timeLeft)}
          </span>
        </div>

        <div className="flex items-center gap-3 mt-6">
          {!isRunning ? (
            <Button onClick={handleStart} disabled={isPending} className="gap-2 px-6">
              <Play className="w-4 h-4 fill-current" />
              Mulai Sesi
            </Button>
          ) : (
            <>
              {isPaused ? (
                <Button
                  onClick={handleResume}
                  disabled={isPending}
                  className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  <Play className="w-4 h-4 fill-current" />
                  Lanjut
                </Button>
              ) : (
                <Button
                  onClick={handlePause}
                  disabled={isPending}
                  variant="outline"
                  className="gap-2"
                >
                  <Pause className="w-4 h-4 fill-current" />
                  Jeda
                </Button>
              )}
              <Button
                onClick={handleStop}
                disabled={isPending}
                variant="destructive"
                className="gap-2"
              >
                <Square className="w-4 h-4 fill-current" />
                Hentikan
              </Button>
            </>
          )}
        </div>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card variant="stat" padding="none" className="p-4.5 flex items-center gap-4">
          <div className="p-3 bg-warning/15 text-warning rounded-xl">
            <Flame className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-muted-foreground">Fokus Hari Ini</div>
            <div className="text-xl font-bold text-foreground tracking-tight">
              {todayMinutes} Menit
            </div>
          </div>
        </Card>

        <Card variant="stat" padding="none" className="p-4.5 flex items-center gap-4">
          <div className="p-3 bg-primary/10 text-primary rounded-xl">
            <BarChart3 className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-muted-foreground">Sesi Selesai</div>
            <div className="text-xl font-bold text-foreground tracking-tight">
              {completedSessions} Sesi
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
