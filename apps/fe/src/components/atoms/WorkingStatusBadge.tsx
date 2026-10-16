import type { WorkingStatus } from '@repo/types';
import { Clock } from 'lucide-react';
import React from 'react';

import { Badge } from '@/components/atoms';
import { cn } from '@/utils/classname';

export interface WorkingStatusBadgeProps {
  status?: WorkingStatus;
  statusLabel?: string;
  className?: string;
  compact?: boolean;
}

export function WorkingStatusBadge({
  status = 'working',
  statusLabel,
  className,
  compact = false,
}: WorkingStatusBadgeProps) {
  const isWorking = status === 'working';
  const label = statusLabel || (isWorking ? 'Sedang kerja' : 'Di luar jam kerja');

  if (isWorking) {
    return (
      <Badge
        variant="outline"
        className={cn(
          'inline-flex items-center gap-1.5 px-2 py-0.5 text-[11px] font-medium transition-colors',
          'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/25',
          compact && 'px-1.5 py-0 text-[10px]',
          className,
        )}
      >
        <span className="relative flex size-1.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex size-1.5 rounded-full bg-emerald-500" />
        </span>
        <span>{compact ? 'Aktif' : label}</span>
      </Badge>
    );
  }

  return (
    <Badge
      variant="outline"
      className={cn(
        'inline-flex items-center gap-1.5 px-2 py-0.5 text-[11px] font-medium transition-colors',
        'bg-muted/70 text-muted-foreground border-border/50',
        compact && 'px-1.5 py-0 text-[10px]',
        className,
      )}
    >
      <Clock className="size-3 shrink-0 opacity-70" />
      <span className="truncate">{label}</span>
    </Badge>
  );
}

export default WorkingStatusBadge;
