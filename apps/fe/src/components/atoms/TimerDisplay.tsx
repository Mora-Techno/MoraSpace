import * as React from "react";
import { cn } from "@/utils/classname";

interface TimerDisplayProps extends React.HTMLAttributes<HTMLDivElement> {
  minutes: number;
  seconds: number;
}

export function TimerDisplay({
  minutes,
  seconds,
  className,
  ...props
}: TimerDisplayProps) {
  const formatTime = (time: number) => String(time).padStart(2, "0");

  return (
    <div
      className={cn(
        "font-mono text-5xl font-bold tracking-tighter tabular-nums",
        className,
      )}
      {...props}
    >
      {formatTime(minutes)}:{formatTime(seconds)}
    </div>
  );
}
