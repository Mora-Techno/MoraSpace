import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import type * as React from 'react';

import type { RegisterProps } from '@/types/ui';

const RegisterCard: React.FC<RegisterProps> = ({ href, icon: Icon, title }) => {
  return (
    <div className="group w-full rounded-2xl border border-border/70 bg-card/85 p-4 text-card-foreground shadow-2xs backdrop-blur-md transition-all duration-200 hover:border-primary/50 hover:bg-card hover:shadow-xs hover:-translate-y-0.5">
      <Link href={href} className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          {Icon && (
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary/15">
              <Icon className="size-5" />
            </div>
          )}
          <span className="text-sm font-semibold tracking-tight text-foreground">{title}</span>
        </div>
        <ArrowRight className="size-4.5 text-muted-foreground transition-all duration-200 group-hover:text-primary group-hover:translate-x-1 shrink-0" />
      </Link>
    </div>
  );
};

export default RegisterCard;
