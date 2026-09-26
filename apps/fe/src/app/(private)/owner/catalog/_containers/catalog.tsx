"use client";

import { useTrackCatalog } from "@/hooks/useApi/trackCatalog/useTrackCatalog";
import { CatalogReviewSection } from "@/components/page/private/owner/catalog/catalog.section";

export default function CatalogReviewContainer() {
  const { query, mutate } = useTrackCatalog();
  const { data: pendingTracks = [], isLoading } = query.pending();
  const approveTrack = mutate.approve();
  const rejectTrack = mutate.reject();

  const handleApprove = (id: string) => {
    approveTrack.mutate(id);
  };

  const handleReject = (id: string, reason: string) => {
    rejectTrack.mutate({
      id,
      payload: { rejectionReason: reason },
    });
  };

  return (
    <CatalogReviewSection
      service={{
        pendingTracks,
        isLoading,
        handleApprove,
        handleReject,
        isApprovePending: approveTrack.isPending,
        isRejectPending: rejectTrack.isPending,
      }}
    />
  );
}
