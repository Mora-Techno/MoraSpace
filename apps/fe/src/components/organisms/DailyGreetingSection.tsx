import * as React from "react";
import { StatMiniCard } from "@/components/molecules/StatMiniCard";
import { CheckCircle2, Clock, CalendarIcon } from "lucide-react";
import { GlassCard } from "@/components/molecules/GlassCard";

interface DailyStats {
  completedTodos: number;
  pomodoroMinutes: number;
  totalMeetings: number;
}

interface DailyGreetingSectionProps {
  state: {
    name: string;
    greeting: string;
    currentDate: string;
    stats: DailyStats;
  };
}

export function DailyGreetingSection({ state }: DailyGreetingSectionProps) {
  const { name, greeting, currentDate, stats } = state;

  return (
    <GlassCard
      className="col-span-full mb-4 flex flex-col md:flex-row md:items-center justify-between p-6 gap-6"
      data-stagger-item
    >
      <div>
        <p className="text-sm text-muted-foreground mb-1">{currentDate}</p>
        <h1 className="font-serif text-2xl font-bold md:text-3xl">
          {greeting}, {name}!
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Berikut ringkasan capaianmu hari ini. Siap untuk fokus lagi?
        </p>
      </div>

      <div className="flex flex-wrap gap-4">
        <StatMiniCard
          title="Tugas Belum Selesai"
          value={stats.completedTodos}
          icon={<CheckCircle2 className="size-4" />}
          className="min-w-[140px] bg-background/50 flex-1"
        />
        <StatMiniCard
          title="Menit Fokus"
          value={stats.pomodoroMinutes}
          icon={<Clock className="size-4" />}
          className="min-w-[140px] bg-background/50 flex-1"
        />
        <StatMiniCard
          title="Meeting Hari Ini"
          value={stats.totalMeetings}
          icon={<CalendarIcon className="size-4" />}
          className="min-w-[140px] bg-background/50 flex-1"
        />
      </div>
    </GlassCard>
  );
}
