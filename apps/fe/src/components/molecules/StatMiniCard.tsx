import * as React from "react";
import { GlassCard } from "./GlassCard";
import { cn } from "@/utils/classname";

interface StatMiniCardProps {
  title: string;
  value: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
}

export function StatMiniCard({
  title,
  value,
  icon,
  className,
}: StatMiniCardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border bg-card text-card-foreground shadow-sm p-4 flex flex-col gap-1",
        className,
      )}
    >
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        {icon && <span className="text-primary">{icon}</span>}
        <span>{title}</span>
      </div>
      <div className="text-2xl font-bold">{value}</div>
    </div>
  );
}
