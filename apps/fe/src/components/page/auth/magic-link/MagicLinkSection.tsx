'use client';

import { Loader2, MailCheck } from 'lucide-react';
import Link from 'next/link';
import type React from 'react';

interface MagicLinkSectionProps {
  initial: {
    title: string;
    desc: string;
  };
  loading?: boolean;
}

const MagicLinkSection: React.FC<MagicLinkSectionProps> = ({ initial, loading = true }) => {
  return (
    <div className="w-full space-y-6 text-center">
      <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-primary/15 text-primary border border-primary/20">
        {loading ? <Loader2 className="size-8 animate-spin" /> : <MailCheck className="size-8" />}
      </div>

      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          {initial.title}
        </h1>
        <p className="text-sm text-muted-foreground leading-relaxed max-w-sm mx-auto">
          {initial.desc}
        </p>
      </div>

      <div className="rounded-xl border border-border/70 bg-card/60 p-4 text-xs text-muted-foreground">
        {loading
          ? 'Sedang memverifikasi Magic Link Anda. Mohon tunggu beberapa saat dan jangan menutup halaman ini.'
          : 'Verifikasi selesai. Anda akan segera diarahkan secara otomatis.'}
      </div>

      <div className="pt-2">
        <Link
          href="/login"
          className="inline-flex items-center text-sm font-semibold text-primary hover:underline"
        >
          ← Kembali ke halaman Masuk
        </Link>
      </div>
    </div>
  );
};

export default MagicLinkSection;
