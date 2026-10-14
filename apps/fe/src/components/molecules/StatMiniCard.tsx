import type * as React from 'react';

import { cn } from '@/utils/classname';

interface StatMiniCardProps {
  title: string;
  value: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
}

export function StatMiniCard({ title, value, icon, className }: StatMiniCardProps) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-border/50 bg-card/75 text-card-foreground shadow-2xs backdrop-blur-md p-4 flex flex-col gap-1.5 transition-all duration-200 hover:border-border/80 hover:bg-card/90',
        className,
      )}
    >
      <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
        {icon && <span className="text-primary shrink-0">{icon}</span>}
        <span className="truncate">{title}</span>
      </div>
      <div className="text-2xl font-bold tracking-tight text-foreground">{value}</div>
    </div>
  );
}
