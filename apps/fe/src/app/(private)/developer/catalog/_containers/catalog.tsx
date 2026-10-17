'use client';

import type { IMusicPlayListItem, TrackCatalog } from '@repo/types';

import { DeveloperCatalogSection } from '@/components/page/private/developer/catalog.section';
import { useMusicPlayer } from '@/context/MusicPlayerContext';
import { useTrackCatalog } from '@/hooks/useApi/trackCatalog/useTrackCatalog';

export default function DeveloperCatalogReviewContainer() {
  const { query, mutate } = useTrackCatalog();
  const { data: pendingTracks = [], isLoading: isPendingLoading } = query.pending();
  const { data: allTracks = [], isLoading: isAllLoading } = query.list({
    status: 'ALL' as any,
  });

  const approveTrack = mutate.approve();
  const rejectTrack = mutate.reject();
  const deleteTrack = mutate.delete();
  const submitTrack = mutate.submit();

  const musicPlayer = useMusicPlayer();

  const handleApprove = (id: string) => {
    approveTrack.mutate(id);
  };

  const handleReject = (id: string, reason?: string) => {
    rejectTrack.mutate({
      id,
      payload: { rejectionReason: reason },
    });
  };

  const handleDelete = (id: string) => {
    deleteTrack.mutate(id);
  };

  const handleSubmit = async (title: string, youtubeUrl: string) => {
    await submitTrack.mutateAsync({
      title,
      youtubeUrl,
    });
  };

  const handlePlayTrack = (track: TrackCatalog) => {
    const isCurrentPlaying = musicPlayer.currentTrack?.id === track.id;
    if (isCurrentPlaying && musicPlayer.isPlaying) {
      musicPlayer.pause();
    } else if (isCurrentPlaying) {
      musicPlayer.toggle(musicPlayer.currentTrack!);
    } else {
      const playItem: IMusicPlayListItem = {
        id: track.id,
        playlistId: 'catalog-preview',
        title: track.title,
        youtubeUrl: track.youtubeUrl,
        createdAt: new Date(track.createdAt),
        updatedAt: new Date(track.updatedAt),
      };
      musicPlayer.play(playItem, 'Track Catalog Global');
    }
  };

  return (
    <DeveloperCatalogSection
      service={{
        pendingTracks,
        allTracks,
        isLoading: isPendingLoading || isAllLoading,
        isApprovePending: approveTrack.isPending,
        isRejectPending: rejectTrack.isPending,
        isDeletePending: deleteTrack.isPending,
        isSubmitPending: submitTrack.isPending,
        currentPlayingId: musicPlayer.currentTrack?.id ?? null,
        isPlaying: musicPlayer.isPlaying,
        onApprove: handleApprove,
        onReject: handleReject,
        onDelete: handleDelete,
        onSubmit: handleSubmit,
        onPlayTrack: handlePlayTrack,
      }}
    />
  );
}
