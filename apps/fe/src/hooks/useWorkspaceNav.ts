'use client';

import { usePathname } from 'next/navigation';
import { useMemo } from 'react';

import { useWorkspaces } from '@/hooks/useApi/auth/state/query';
import { loadAuthSession } from '@/utils/storage';

/**
 * Role penggerak navigasi (sidebar & bottom-nav).
 * Workspace personal langsung pakai nav `personal`; company ikut role tersimpan.
 * Reaktif terhadap switch workspace: query workspaces di-reset (refetch)
 * setelah mutasi switchWorkspace sukses, tanpa fetcher baru (cache dipakai bareng).
 */
export function useWorkspaceNavRole(): string | undefined {
  const pathname = usePathname();
  const { data } = useWorkspaces();

  return useMemo(() => {
    if (pathname.startsWith('/developer')) return 'developer';
    if (data?.activeType === 'personal') return 'personal';
    return loadAuthSession()?.role?.toLowerCase();
  }, [data?.activeType, pathname]);
}
