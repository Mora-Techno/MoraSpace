'use client';

import { useRouter } from 'next/navigation';

import { DeveloperDashboardSection } from '@/components/page/private/developer/dashboard.section';
import { useTrackCatalog } from '@/hooks/useApi/trackCatalog/useTrackCatalog';
import { loadAuthSession } from '@/utils/storage';

export default function DeveloperDashboardContainer() {
  const router = useRouter();
  const { query } = useTrackCatalog();
  const { data: pendingTracks = [], isLoading } = query.pending();

  const session = loadAuthSession();
  const platformRole = session?.platformRole || 'DEVELOPER';

  const handleNavigateCatalog = () => {
    router.push('/developer/catalog');
  };

  const handleNavigateWorkspace = () => {
    const role = session?.role?.toLowerCase();
    const target = role === 'owner' ? '/owner/dashboard' : '/member/dashboard';
    router.push(target);
  };

  return (
    <DeveloperDashboardSection
      service={{
        pendingTracksCount: pendingTracks.length,
        platformRole,
        isLoading,
        onNavigateCatalog: handleNavigateCatalog,
        onNavigateWorkspace: handleNavigateWorkspace,
      }}
    />
  );
}
