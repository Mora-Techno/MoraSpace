'use client';

import OwnerDashboardSection from '@/components/page/private/owner/dashboard/dashboard.section';
import { useApi } from '@/hooks/useApi/useApi';

export default function OwnerDashboardContainer() {
  const api = useApi();
  const { data: overview, isLoading, isError, refetch } = api.dashboard.query.ownerOverview();

  return (
    <OwnerDashboardSection
      service={{
        isLoading,
        isError,
        hasData: !!overview,
        onRetry: () => refetch(),
      }}
      state={{ overview }}
    />
  );
}
