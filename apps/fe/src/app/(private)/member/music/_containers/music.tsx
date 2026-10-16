'use client';

import type { TrackCatalog } from '@repo/types';
import { useState } from 'react';

import { MusicSection } from '@/components/page/private/member/music/music.section';
import { useApi } from '@/hooks/useApi/useApi';
import { useGsapStagger } from '@/hooks/useGsapStagger';

export default function MusicContainer() {
  const api = useApi();
  const usePlaylists = api.music.query.getPlayList();
  const useCreatePlaylist = api.music.mutate.create();
  const useDeletePlaylist = api.music.mutate.delete();
  const useAddItem = api.music.mutate.addItem();
  const { data: playlists = [], isLoading } = usePlaylists;
  const createPlaylist = useCreatePlaylist;
  const deletePlaylist = useDeletePlaylist;
  const [title, setTitle] = useState('');
  const gridRef = useGsapStagger<HTMLDivElement>([playlists.length]);

  // Track Catalog
  const useTrackCatalog = api.trackCatalog;
  const { data: tracks = [], isLoading: tracksLoading } = useTrackCatalog.query.list();
  const [catalogSearch, setCatalogSearch] = useState('');

  const filteredTracks = tracks.filter(
    (t) =>
      t.title.toLowerCase().includes(catalogSearch.toLowerCase()) ||
      t.youtubeUrl.toLowerCase().includes(catalogSearch.toLowerCase()),
  );

  const handleAddTrackToPlaylist = (playlistId: string, track: TrackCatalog) => {
    useAddItem.mutate({
      playlistId,
      trackCatalogId: track.id,
    });
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    createPlaylist.mutate(
      { name: title.trim(), description: title.trim() },
      {
        onSuccess: () => {
          setTitle('');
        },
      },
    );
  };

  return (
    <MusicSection
      service={{
        playlists,
        isLoading,
        tracksLoading,
        filteredTracks,
        createPending: createPlaylist.isPending,
        handleAddTrackToPlaylist,
        handleAdd,
        handleDeletePlaylist: (id) => deletePlaylist.mutate(id),
        handleDeletePlaylistItem: (playlistId) => deletePlaylist.mutate(playlistId),
        gridRef,
      }}
      state={{
        title,
        setTitle,
        catalogSearch,
        setCatalogSearch,
      }}
    />
  );
}
