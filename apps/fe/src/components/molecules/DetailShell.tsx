import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import type { ReactNode } from 'react';

import { Button } from '@/components/atoms';
import { PageHeader } from '@/components/molecules/PageHeader';

interface DetailShellProps {
  title: string;
  description?: string;
  backHref: string;
  backLabel?: string;
  isLoading: boolean;
  loadingHeight?: string;
  children: ReactNode;
}

export function DetailShell({
  title,
  description,
  backHref,
  backLabel = 'Kembali',
  isLoading,
  loadingHeight = 'h-64',
  children,
}: DetailShellProps) {
  return (
    <div className="animate-in fade-in duration-700">
      <PageHeader
        title={title}
        description={description}
        action={
          <Button variant="outline" size="sm" asChild className="ghibli-btn">
            <Link href={backHref}>
              <ArrowLeft className="size-4" /> {backLabel}
            </Link>
          </Button>
        }
      />
      {isLoading ? (
        <div className="space-y-4">
          <div className="h-8 w-48 animate-pulse rounded-lg bg-muted/50" />
          <div className={`w-full animate-pulse rounded-2xl bg-muted/50 ${loadingHeight}`} />
        </div>
      ) : (
        children
      )}
    </div>
  );
}

export default DetailShell;
