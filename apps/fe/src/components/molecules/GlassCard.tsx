import * as React from 'react';

import { Card, type CardProps } from '@/components/atoms';
import { cn } from '@/utils/classname';

export function GlassCard({ className, children, ...props }: CardProps) {
  return (
    <Card
      variant="glass"
      padding="none"
      className={cn(
        'gsap-widget transition-all duration-300 hover:shadow-xl hover:shadow-black/[0.04]',
        className,
      )}
      {...props}
    >
      {children}
    </Card>
  );
}
