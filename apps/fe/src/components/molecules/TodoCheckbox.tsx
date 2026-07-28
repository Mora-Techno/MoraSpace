'use client';

import { Check, Leaf } from 'lucide-react';

import { cn } from '@/utils/classname';

type TodoCheckboxProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
};

export function TodoCheckbox({ checked, onChange, disabled }: TodoCheckboxProps) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={cn(
        'flex size-6 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-300',
        checked
          ? 'border-primary bg-primary text-primary-foreground scale-110'
          : 'border-primary/40 bg-background hover:border-primary hover:scale-105',
        disabled && 'opacity-50',
      )}
    >
      {checked ? <Leaf className="size-3.5" /> : <Check className="size-0 opacity-0" />}
    </button>
  );
}
