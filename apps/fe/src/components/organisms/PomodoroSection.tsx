import * as React from "react";
import { GlassCard } from "@/components/molecules/GlassCard";
import { WidgetHeader } from "@/components/atoms/WidgetHeader";
import { TimerDisplay } from "@/components/atoms/TimerDisplay";
import { FocusToggle } from "@/components/atoms/FocusToggle";
import { Button } from "@/components/atoms";
import { Clock, Play, Pause, Square } from "lucide-react";

interface PomodoroSectionProps {
  service: {
    handleStart: () => void;
    handlePause: () => void;
    handleStop: () => void;
    handleToggleFocus: (val: boolean) => void;
  };
  state: {
    isFocused: boolean;
    isActive: boolean;
    minutes: number;
    seconds: number;
    isStartPending: boolean;
    isStopPending: boolean;
  };
}

export function PomodoroSection({ service, state }: PomodoroSectionProps) {
  const { handleStart, handlePause, handleStop, handleToggleFocus } = service;
  const { isFocused, isActive, minutes, seconds } = state;

  return (
    <GlassCard className="p-6 relative overflow-hidden" data-stagger-item>
      {/* Visual flair for focus mode */}
      {isFocused && (
        <div className="absolute inset-0 bg-primary/5 pointer-events-none transition-colors duration-1000" />
      )}

      <WidgetHeader
        title="Fokus Workspace"
        icon={<Clock className="size-5" />}
        action={
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Mode Fokus</span>
            <FocusToggle isFocused={isFocused} onToggle={handleToggleFocus} />
          </div>
        }
      />

      <div className="mt-6 flex flex-col items-center justify-center">
        <TimerDisplay
          minutes={minutes}
          seconds={seconds}
          className={
            isActive ? "text-primary dark:text-primary" : "text-foreground"
          }
        />

        <div className="mt-8 flex items-center gap-4">
          {!isActive ? (
            <Button
              size="lg"
              onClick={handleStart}
              className="rounded-full shadow-lg h-14 px-8 text-base"
            >
              <Play className="mr-2 size-5 fill-current" /> Mulai
            </Button>
          ) : (
            <>
              <Button
                size="lg"
                variant="outline"
                onClick={handlePause}
                className="rounded-full h-14 w-14 p-0"
              >
                <Pause className="size-5 fill-current" />
              </Button>
              <Button
                size="lg"
                variant="destructive"
                onClick={handleStop}
                className="rounded-full h-14 w-14 p-0"
              >
                <Square className="size-5 fill-current" />
              </Button>
            </>
          )}
        </div>
      </div>
    </GlassCard>
  );
}
