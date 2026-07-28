import * as React from "react";
import { GlassCard } from "@/components/molecules/GlassCard";
import { WidgetHeader } from "@/components/atoms/WidgetHeader";
import { Calendar as CalendarIcon, ArrowRight } from "lucide-react";
import { AgendaTimelineItem } from "@/components/molecules/AgendaTimelineItem";
import { Skeleton } from "@/components/atoms/Skeleton";
import Link from "next/link";

interface AgendaSectionProps {
  state: {
    upcomingEvents: any[];
    isLoading: boolean;
  };
}

export function AgendaSection({ state }: AgendaSectionProps) {
  const { upcomingEvents, isLoading } = state;

  return (
    <GlassCard className="p-6 flex flex-col h-[420px]" data-stagger-item>
      <WidgetHeader
        title="Agenda Hari Ini"
        icon={<CalendarIcon className="size-5" />}
        action={
          <Link
            href="/member/calendar"
            className="text-xs font-medium text-primary hover:underline flex items-center gap-1"
          >
            Agenda penuh <ArrowRight className="size-3" />
          </Link>
        }
      />

      <div className="flex-1 overflow-y-auto space-y-3 mt-4 pr-2">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full rounded-xl" />
          ))
        ) : upcomingEvents.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center text-center text-muted-foreground opacity-70">
            <span className="text-4xl mb-2">🌙</span>
            <p className="text-sm">
              Kamu free! Tidak ada jadwal mendatang hari ini.
            </p>
          </div>
        ) : (
          upcomingEvents.map((event: any) => (
            <AgendaTimelineItem key={event.id} event={event} />
          ))
        )}
      </div>
    </GlassCard>
  );
}
