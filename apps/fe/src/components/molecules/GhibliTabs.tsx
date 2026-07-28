'use client';

import { cn } from '@/utils/classname';

export type GhibliTab<T extends string> = {
  value: T;
  label: string;
};

type GhibliTabsProps<T extends string> = {
  tabs: GhibliTab<T>[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
};

export function GhibliTabs<T extends string>({
  tabs,
  value,
  onChange,
  className,
}: GhibliTabsProps<T>) {
  return (
    <div className={cn('inline-flex flex-wrap gap-2 rounded-2xl bg-muted/60 p-1.5', className)}>
      {tabs.map((tab) => (
        <button
          key={tab.value}
          type="button"
          onClick={() => onChange(tab.value)}
          className={cn(
            'rounded-xl px-4 py-2 text-sm font-medium transition-all duration-300',
            value === tab.value
              ? 'bg-primary text-primary-foreground shadow-sm'
              : 'text-muted-foreground hover:bg-background/80 hover:text-foreground',
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
