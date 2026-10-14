import { cva, type VariantProps } from 'class-variance-authority';
import type * as React from 'react';

import { cn } from '@/utils/classname';

const cardVariants = cva('text-card-foreground flex flex-col transition-colors', {
  variants: {
    variant: {
      default: 'bg-card border border-border/60 shadow-xs backdrop-blur-md rounded-2xl',
      glass:
        'bg-card/70 border border-border/40 shadow-lg shadow-black/[0.02] backdrop-blur-xl dark:border-border/30 dark:bg-card/60 dark:shadow-black/[0.08] rounded-2xl',
      interactive:
        'bg-card/80 border border-border/60 shadow-xs backdrop-blur-md rounded-2xl hover:border-primary/40 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer',
      stat: 'bg-card/75 border border-border/50 shadow-xs backdrop-blur-md rounded-2xl',
      flat: 'bg-muted/40 border border-border/40 rounded-2xl',
      accent: 'bg-primary/5 border border-primary/25 backdrop-blur-md rounded-2xl',
    },
    padding: {
      default: 'py-6 gap-6',
      sm: 'p-4 gap-3',
      md: 'p-5 gap-4',
      lg: 'p-6 gap-6',
      none: 'p-0 gap-0',
    },
  },
  defaultVariants: {
    variant: 'default',
    padding: 'default',
  },
});

export interface CardProps extends React.ComponentProps<'div'>, VariantProps<typeof cardVariants> {}

function Card({ className, variant, padding, ...props }: CardProps) {
  return (
    <div
      data-slot="card"
      className={cn(cardVariants({ variant, padding }), className)}
      {...props}
    />
  );
}

function CardHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        '@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6',
        className,
      )}
      {...props}
    />
  );
}

function CardTitle({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-title"
      className={cn('leading-none font-semibold text-foreground tracking-tight', className)}
      {...props}
    />
  );
}

function CardDescription({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-description"
      className={cn('text-muted-foreground text-sm', className)}
      {...props}
    />
  );
}

function CardAction({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-action"
      className={cn('col-start-2 row-span-2 row-start-1 self-start justify-self-end', className)}
      {...props}
    />
  );
}

function CardContent({ className, ...props }: React.ComponentProps<'div'>) {
  return <div data-slot="card-content" className={cn('px-6', className)} {...props} />;
}

function CardFooter({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-footer"
      className={cn('flex items-center px-6 [.border-t]:pt-6', className)}
      {...props}
    />
  );
}

export {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  cardVariants,
};
