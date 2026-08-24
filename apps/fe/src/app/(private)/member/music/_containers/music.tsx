"use client";

import {
  ExternalLink,
  Music2,
  Plus,
  Shuffle,
  Trash2,
  Pause,
  Play,
  Disc3,
  Search,
} from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/atoms";
import { GhibliCard } from "@/components/molecules/GhibliCard";
import { PageHeader } from "@/components/molecules/PageHeader";
import { GhibliEmptyState } from "@/components/templates/GhibliEmptyState";
import { useApi } from "@/hooks/useApi/useApi";
import { useGsapStagger } from "@/hooks/useGsapStagger";
import { useMusicPlayer } from "@/context/MusicPlayerContext";
import type {
  TrackCatalog,
  IMusicPlayListItem,
  PickCreatePlaylist,
} from "@repo/types";
import { cn } from "@/utils/classname";

export default function MusicContainer() {
  const api = useApi();
  const usePlaylists = api.music.query.getPlayList();
  const useCreatePlaylist = api.music.mutate.create();
  const useDeletePlaylist = api.music.mutate.delete();
  const useAddItem = api.music.mutate.addItem();
  const useDeleteItem = api.music.mutate.deleteItem();
  const { data: playlists = [], isLoading } = usePlaylists;
  const createPlaylist = useCreatePlaylist;
  const deletePlaylist = useDeletePlaylist;
  const [title, setTitle] = useState("");
  const gridRef = useGsapStagger<HTMLDivElement>([playlists.length]);

  // Track Catalog
  const useTrackCatalog = api.trackCatalog;
  const { data: tracks = [], isLoading: tracksLoading } =
    useTrackCatalog.query.list();
  const [catalogSearch, setCatalogSearch] = useState("");
  const [selectedPlaylistId, setSelectedPlaylistId] = useState<string | null>(
    null,
  );

  const musicPlayer = useMusicPlayer();

  const filteredTracks = tracks.filter(
    (t) =>
      t.title.toLowerCase().includes(catalogSearch.toLowerCase()) ||
      t.youtubeUrl.toLowerCase().includes(catalogSearch.toLowerCase()),
  );

  const handlePlayCatalogTrack = (track: TrackCatalog) => {
    const playerItem: IMusicPlayListItem = {
      id: track.id,
      playlistId: "",
      title: track.title,
      youtubeUrl: track.youtubeUrl,
      createdAt: track.createdAt,
      updatedAt: track.updatedAt,
    };
    musicPlayer.play(playerItem, "Katalog Track");
  };

  const handleAddTrackToPlaylist = (
    playlistId: string,
    track: TrackCatalog,
  ) => {
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
          setTitle("");
        },
      },
    );
  };

  return (
    <div className="animate-in fade-in duration-700">
      <PageHeader
        title="Musik & Fokus"
        description="Playlist Joe Hisaishi dan lo-fi Ghibli untuk menemani sesi kerja."
      />

      {musicPlayer.currentTrack && (
        <div className="ghibli-glass sticky top-20 z-30 mb-6 overflow-hidden rounded-2xl border-2 border-primary/20 p-3 md:static">
          <div className="mb-2 flex items-center gap-2 font-serif text-sm font-medium">
            <Music2 className="size-4 text-primary" /> Sedang diputar
          </div>
          <div className="flex items-center gap-3">
            <p className="flex-1 truncate text-sm">
              {musicPlayer.currentTrack.title}
            </p>
            <Button
              variant="ghost"
              size="sm"
              onClick={() =>
                musicPlayer.isPlaying
                  ? musicPlayer.pause()
                  : musicPlayer.toggle(musicPlayer.currentTrack!)
              }
            >
              {musicPlayer.isPlaying ? "Jeda" : "Putar"}
            </Button>
            <Button variant="ghost" size="sm" onClick={musicPlayer.stop}>
              Stop
            </Button>
          </div>
          {musicPlayer.queue.length > 1 && (
            <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
              <span>
                {musicPlayer.currentIndex + 1} / {musicPlayer.queue.length} lagu
              </span>
              {musicPlayer.isShuffle && (
                <span className="flex items-center gap-1 text-primary">
                  <Shuffle className="size-3" /> Acak
                </span>
              )}
            </div>
          )}
        </div>
      )}

      {/* Track Catalog Section */}
      <GhibliCard className="mb-6">
        <div className="mb-3 flex items-center gap-2">
          <Disc3 className="size-4 text-primary" />
          <h3 className="font-serif text-sm font-medium">Katalog Track</h3>
          {tracksLoading && (
            <span className="text-xs text-muted-foreground">Memuat...</span>
          )}
        </div>

        {/* Search */}
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={catalogSearch}
            onChange={(e) => setCatalogSearch(e.target.value)}
            placeholder="Cari track..."
            className="w-full rounded-xl border border-input bg-background/80 py-2 pl-9 pr-4 text-sm outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        {/* Playlist selector for adding tracks */}
        {playlists.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-1.5">
            <span className="text-xs text-muted-foreground self-center mr-1">
              Tambah ke:
            </span>
            {playlists.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() =>
                  setSelectedPlaylistId(
                    selectedPlaylistId === p.id ? null : p.id,
                  )
                }
                className={cn(
                  "rounded-full px-2.5 py-0.5 text-xs transition-colors",
                  selectedPlaylistId === p.id
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted/50 text-muted-foreground hover:bg-muted",
                )}
              >
                {p.name}
              </button>
            ))}
          </div>
        )}

        {/* Track list */}
        <div className="max-h-64 space-y-1 overflow-y-auto pr-1">
          {tracksLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-10 animate-pulse rounded-lg bg-muted" />
            ))
          ) : filteredTracks.length === 0 ? (
            <p className="py-4 text-center text-xs text-muted-foreground italic">
              {tracks.length === 0
                ? "Belum ada track di katalog. Ajukan track baru!"
                : "Tidak ada track yang cocok."}
            </p>
          ) : (
            filteredTracks.map((track) => {
              const isCurrentTrack = musicPlayer.currentTrack?.id === track.id;
              const isTrackPlaying = isCurrentTrack && musicPlayer.isPlaying;

              return (
                <div
                  key={track.id}
                  className={cn(
                    "flex items-center gap-2 rounded-lg px-2 py-1.5 transition-colors hover:bg-muted/30",
                    isCurrentTrack && "bg-primary/5",
                  )}
                >
                  <button
                    type="button"
                    onClick={() => {
                      if (isTrackPlaying) {
                        musicPlayer.pause();
                      } else if (isCurrentTrack) {
                        musicPlayer.toggle(musicPlayer.currentTrack!);
                      } else {
                        handlePlayCatalogTrack(track);
                      }
                    }}
                    className={cn(
                      "flex size-8 shrink-0 items-center justify-center rounded-full transition-colors",
                      isCurrentTrack
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted/50 text-muted-foreground hover:bg-primary/10 hover:text-primary",
                    )}
                  >
                    {isTrackPlaying ? (
                      <Pause className="size-3.5" />
                    ) : (
                      <Play className="size-3.5 ml-0.5" />
                    )}
                  </button>

                  <div className="min-w-0 flex-1">
                    <p
                      className={cn(
                        "truncate text-xs font-medium",
                        isCurrentTrack && "text-primary",
                      )}
                    >
                      {track.title}
                    </p>
                  </div>

                  {/* Add to selected playlist */}
                  {selectedPlaylistId && (
                    <button
                      type="button"
                      onClick={() =>
                        handleAddTrackToPlaylist(selectedPlaylistId, track)
                      }
                      className="flex size-7 shrink-0 items-center justify-center rounded-md text-muted-foreground hover:bg-primary/10 hover:text-primary"
                      title="Tambah ke playlist"
                    >
                      <Plus className="size-3.5" />
                    </button>
                  )}

                  <a
                    href={track.youtubeUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex size-7 shrink-0 items-center justify-center rounded-md text-muted-foreground hover:text-primary"
                    title="Buka di YouTube"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <ExternalLink className="size-3.5" />
                  </a>
                </div>
              );
            })
          )}
        </div>
      </GhibliCard>

      {/* Create Playlist Form */}
      <GhibliCard className="mb-6">
        <form onSubmit={handleAdd} className="flex gap-3">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Nama playlist baru"
            className="flex-1 rounded-xl border border-input bg-background/80 px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
          />
          <Button
            type="submit"
            className="ghibli-btn shrink-0"
            disabled={createPlaylist.isPending}
          >
            <Plus className="size-4" /> Tambah
          </Button>
        </form>
      </GhibliCard>

      {/* Playlists Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 animate-pulse rounded-2xl bg-muted" />
          ))}
        </div>
      ) : playlists.length === 0 ? (
        <GhibliEmptyState
          emoji="🎻"
          title="Belum ada playlist"
          description="Buat playlist baru lalu tambahkan track dari katalog."
        />
      ) : (
        <div
          ref={gridRef}
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {playlists.map((playlist) => {
            const items = playlist.items ?? [];
            const isPlayingThisPlaylist =
              musicPlayer.currentTrack &&
              items.some((item) => item.id === musicPlayer.currentTrack?.id);

            return (
              <GhibliCard
                key={playlist.id}
                data-stagger-item
                className="cursor-pointer"
                onClick={() => {
                  if (items.length > 0) {
                    musicPlayer.playPlaylist(items, 0, playlist.name);
                  }
                }}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-serif font-medium">{playlist.name}</h3>
                    <p className="mt-1 line-clamp-1 text-xs text-muted-foreground">
                      {playlist.description}
                      {items.length > 0 && ` · ${items.length} lagu`}
                    </p>
                  </div>
                  <div className="flex gap-1">
                    {items.length > 0 && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-8"
                        onClick={(e) => {
                          e.stopPropagation();
                          musicPlayer.playPlaylist(items, 0, playlist.name);
                          if (!musicPlayer.isShuffle)
                            musicPlayer.toggleShuffle();
                        }}
                        title="Putar acak"
                      >
                        <Shuffle className="size-4" />
                      </Button>
                    )}
                    {items.length > 0 && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-8"
                        asChild
                        onClick={(e) => e.stopPropagation()}
                      >
                        <a
                          href={items[0].youtubeUrl}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <ExternalLink className="size-4" />
                        </a>
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-8"
                      onClick={(e) => {
                        e.stopPropagation();
                        deletePlaylist.mutate(playlist.id);
                      }}
                    >
                      <Trash2 className="size-4 text-destructive" />
                    </Button>
                  </div>
                </div>

                {/* Playlist items preview */}
                {items.length > 0 && (
                  <div className="mt-3 space-y-1 border-t border-border/20 pt-2">
                    {items.slice(0, 3).map((item) => {
                      const isActive = musicPlayer.currentTrack?.id === item.id;
                      const isActivePlaying = isActive && musicPlayer.isPlaying;
                      return (
                        <div
                          key={item.id}
                          className={cn(
                            "flex items-center gap-2 rounded-md px-1.5 py-1 text-xs",
                            isActive && "bg-primary/5",
                          )}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            type="button"
                            onClick={() => {
                              if (isActivePlaying) {
                                musicPlayer.pause();
                              } else if (isActive) {
                                musicPlayer.toggle(item);
                              } else {
                                const idx = items.findIndex(
                                  (i) => i.id === item.id,
                                );
                                musicPlayer.playPlaylist(
                                  items,
                                  idx,
                                  playlist.name,
                                );
                              }
                            }}
                            className={cn(
                              "flex size-6 shrink-0 items-center justify-center rounded-full transition-colors",
                              isActive
                                ? "bg-primary text-primary-foreground"
                                : "text-muted-foreground hover:bg-muted",
                            )}
                          >
                            {isActivePlaying ? (
                              <Pause className="size-2.5" />
                            ) : (
                              <Play className="size-2.5 ml-0.5" />
                            )}
                          </button>
                          <p
                            className={cn(
                              "min-w-0 flex-1 truncate",
                              isActive && "text-primary font-medium",
                            )}
                          >
                            {item.title}
                          </p>
                          <button
                            type="button"
                            onClick={() => deletePlaylist.mutate(playlist.id)}
                            className="size-5 shrink-0 rounded text-muted-foreground hover:text-destructive"
                          >
                            <Trash2 className="size-2.5" />
                          </button>
                        </div>
                      );
                    })}
                    {items.length > 3 && (
                      <p className="text-center text-[10px] text-muted-foreground">
                        +{items.length - 3} lagi
                      </p>
                    )}
                  </div>
                )}
              </GhibliCard>
            );
          })}
        </div>
      )}
    </div>
  );
}
