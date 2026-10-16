'use client';
import { useState } from 'react';

import { OverviewSection } from '@/components/section/private/overview/overview-section';
import { useApi } from '@/hooks/service/useApi';

const OverviewContainer = () => {
  const api = useApi();
  const { data, isLoading, isError, refetch, isFetching } = api.dashboard.query.ownerOverview();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await refetch();
    } finally {
      setRefreshing(false);
    }
  };

  const minutes = data?.deepWorkMinutes ?? 0;
  const deepWorkText =
    minutes >= 60 ? `${Math.floor(minutes / 60)} jam ${minutes % 60} mnt` : `${minutes} mnt`;

  return (
    <OverviewSection
      service={{
        overview: data,
        isLoading,
        isError,
        isFetching,
        refreshing,
        deepWorkText,
        onRefresh,
        onRetry: () => refetch(),
      }}
    />
  );
};

export default OverviewContainer;
