"use client";

import * as React from "react";
import { GlassCard } from "@/components/molecules/GlassCard";
import { WidgetHeader } from "@/components/atoms/WidgetHeader";
import {
  Music,
  Plus,
  Pause,
  Play,
  Trash2,
  ChevronDown,
  ChevronRight,
  Shuffle,
  ListPlus,
  Disc3,
} from "lucide-react";
import { Skeleton } from "@/components/atoms/Skeleton";
import { Button } from "@/components/atoms";
import type {
  PickCreatePlaylist,
  MusicPlaylist,
  IMusicPlayListItem,
  TrackCatalog,
} from "@repo/types";
import { cn } from "@/utils/classname";

interface MusicSectionProps {
  service: {
    handleAdd: (e: React.FormEvent) => void;
    isPending: boolean;
    addItem: (playlistId: string, trackCatalogId: string) => void;
    deleteItem?: (playlistId: string, itemId: string) => void;
  };
  state: {
    playlists: MusicPlaylist[];
    isLoading: boolean;
    formCreatePlaylistMusic: PickCreatePlaylist;
    setFormCreatePlaylistMusic: React.Dispatch<
      React.SetStateAction<PickCreatePlaylist>
    >;

    currentTrack: IMusicPlayListItem | null;
    isPlaying: boolean;
    queue: IMusicPlayListItem[];
    isShuffle: boolean;
    onPlayPlaylist: (
      tracks: IMusicPlayListItem[],
      startIndex?: number,
      playlistName?: string,
    ) => void;
    onTogglePlay: (track?: IMusicPlayListItem, playlistName?: string) => void;
    onPause: () => void;
    onToggleShuffle: () => void;
    onAddToQueue: (track: IMusicPlayListItem) => void;
    tracks?: TrackCatalog[];
    isTracksLoading?: boolean;
    onPlayTrack?: (track: TrackCatalog) => void;
    onAddTrackToPlaylist?: (playlistId: string, track: TrackCatalog) => void;
  };
}

export function MusicSection({ service, state }: MusicSectionProps) {
  const { handleAdd, isPending, addItem, deleteItem } = service;
  const {
    playlists,
    isLoading,
    formCreatePlaylistMusic,
    setFormCreatePlaylistMusic,
    currentTrack,
    isPlaying,
    queue,
    isShuffle,
    onPlayPlaylist,
    onTogglePlay,
    onPause,
    onToggleShuffle,
    onAddToQueue,
    tracks = [],
    isTracksLoading = false,
    onPlayTrack,
    onAddTrackToPlaylist,
  } = state;

  const [expandedPlaylistId, setExpandedPlaylistId] = React.useState<
    string | null
  >(null);
  const [showCatalog, setShowCatalog] = React.useState(false);
  const [selectedPlaylistForAdd, setSelectedPlaylistForAdd] = React.useState<
    string | null
  >(null);

  const toggleExpand = (id: string) => {
    setExpandedPlaylistId((prev) => (prev === id ? null : id));
  };

  const handlePlayCatalogTrack = (track: TrackCatalog) => {
    if (onPlayTrack) {
      onPlayTrack(track);
    }
  };

  const handleAddToPlaylist = (playlistId: string, track: TrackCatalog) => {
    if (onAddTrackToPlaylist) {
      onAddTrackToPlaylist(playlistId, track);
    } else {
      addItem(playlistId, track.id);
    }
  };

  return (
    <GlassCard className="p-6 flex flex-col h-[420px]" data-stagger-item>
      <WidgetHeader title="Teman Fokus" icon={<Music className="size-5" />} />

      <div className="flex-1 overflow-y-auto mb-4 space-y-2 pr-2">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-14 w-full rounded-xl" />
          ))
        ) : playlists.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center text-center text-muted-foreground opacity-70">
            <span className="text-4xl mb-2">🎧</span>
            <p className="text-sm">
              Belum ada playlist lofi/fokus yang tersimpan.
            </p>
          </div>
        ) : (
          playlists.map((playlist: MusicPlaylist) => {
            const isExpanded = expandedPlaylistId === playlist.id;
            const items = playlist.items ?? [];
            const hasItems = items.length > 0;

            const isActivePlaylist = items.some(
              (item) => item.id === currentTrack?.id,
            );

            return (
              <div
                key={playlist.id}
                className={cn(
                  "rounded-xl border transition-colors",
                  isActivePlaylist
                    ? "border-primary/30 bg-primary/5"
                    : "border-border/30 bg-background/30",
                )}
              >
                <div className="flex w-full items-center gap-3 p-3 text-left">
                  <button
                    type="button"
                    onClick={() => toggleExpand(playlist.id)}
                    className="flex size-7 shrink-0 items-center justify-center rounded-md text-muted-foreground hover:bg-muted/50"
                  >
                    {isExpanded ? (
                      <ChevronDown className="size-4" />
                    ) : (
                      <ChevronRight className="size-4" />
                    )}
                  </button>

                  <div
                    className="min-w-0 flex-1 cursor-pointer"
                    onClick={() => toggleExpand(playlist.id)}
                  >
                    <p className="truncate text-sm font-medium">
                      {playlist.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {playlist.description}
                      {hasItems && ` · ${items.length} lagu`}
                    </p>
                  </div>

                  <div className="flex items-center gap-1">
                    {hasItems && (
                      <>
                        <button
                          type="button"
                          onClick={() =>
                            onPlayPlaylist(items, 0, playlist.name)
                          }
                          className="flex size-7 shrink-0 items-center justify-center rounded-md text-muted-foreground hover:bg-muted/50 hover:text-primary"
                          title="Putar semua"
                        >
                          <Play className="size-3.5 ml-0.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            onPlayPlaylist(items, 0, playlist.name);
                            if (!isShuffle) onToggleShuffle();
                          }}
                          className={cn(
                            "flex size-7 shrink-0 items-center justify-center rounded-md transition-colors",
                            isShuffle && isActivePlaylist
                              ? "text-primary bg-primary/10"
                              : "text-muted-foreground hover:bg-muted/50 hover:text-primary",
                          )}
                          title="Putar acak"
                        >
                          <Shuffle className="size-3.5" />
                        </button>
                      </>
                    )}

                    <button
                      type="button"
                      onClick={() => {
                        setShowCatalog(true);
                        setSelectedPlaylistForAdd(playlist.id);
                      }}
                      className="flex size-7 shrink-0 items-center justify-center rounded-md text-muted-foreground hover:bg-muted/50 hover:text-primary"
                      title="Tambah lagu dari katalog"
                    >
                      <Plus className="size-4" />
                    </button>
                  </div>
                </div>

                {/* Items list */}
                {isExpanded && hasItems && (
                  <div className="border-t border-border/20 px-3 pb-2">
                    {items.map((item, itemIndex) => {
                      const isCurrentTrack = currentTrack?.id === item.id;
                      const isItemPlaying = isCurrentTrack && isPlaying;

                      return (
                        <div
                          key={item.id}
                          className={cn(
                            "flex items-center gap-2 rounded-lg px-2 py-1.5 transition-colors hover:bg-muted/30",
                            isCurrentTrack && "bg-primary/5",
                          )}
                        >
                          <button
                            type="button"
                            onClick={() => {
                              if (isItemPlaying) {
                                onPause();
                              } else if (isCurrentTrack) {
                                onTogglePlay(item, playlist.name);
                              } else {
                                onPlayPlaylist(items, itemIndex, playlist.name);
                              }
                            }}
                            className={cn(
                              "flex size-7 shrink-0 items-center justify-center rounded-full transition-colors",
                              isCurrentTrack
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted/50 text-muted-foreground hover:bg-primary/10 hover:text-primary",
                            )}
                          >
                            {isItemPlaying ? (
                              <Pause className="size-3" />
                            ) : (
                              <Play className="size-3 ml-0.5" />
                            )}
                          </button>

                          <p
                            className={cn(
                              "min-w-0 flex-1 truncate text-xs",
                              isCurrentTrack && "text-primary font-medium",
                            )}
                          >
                            {item.title || "No Title"}
                          </p>

                          <button
                            type="button"
                            onClick={() => onAddToQueue(item)}
                            className="size-5 shrink-0 rounded text-muted-foreground hover:text-primary"
                            title="Tambah ke antrean"
                          >
                            <ListPlus className="size-3" />
                          </button>

                          {deleteItem && (
                            <button
                              type="button"
                              onClick={() => deleteItem(playlist.id, item.id)}
                              className="size-5 shrink-0 rounded text-muted-foreground hover:text-destructive"
                            >
                              <Trash2 className="size-3" />
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}

                {isExpanded && !hasItems && (
                  <div className="border-t border-border/20 px-3 pb-2 pt-2 text-center">
                    <p className="text-xs text-muted-foreground/70 italic">
                      Belum ada lagu. Klik + untuk menambah dari katalog.
                    </p>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Track Catalog Popup */}
      {showCatalog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="mx-4 w-full max-w-lg max-h-[80vh] overflow-hidden rounded-2xl border border-border/50 bg-background shadow-2xl">
            {/* Catalog header */}
            <div className="flex items-center justify-between border-b border-border/30 px-4 py-3">
              <div className="flex items-center gap-2">
                <Disc3 className="size-4 text-primary" />
                <h3 className="text-sm font-medium">Katalog Track</h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowCatalog(false);
                  setSelectedPlaylistForAdd(null);
                }}
                className="flex size-7 items-center justify-center rounded-md text-muted-foreground hover:bg-muted/50"
              >
                ✕
              </button>
            </div>

            {/* Target playlist info */}
            {selectedPlaylistForAdd && (
              <div className="border-b border-border/20 bg-primary/5 px-4 py-2">
                <p className="text-xs text-muted-foreground">
                  Menambah ke:{" "}
                  <span className="font-medium text-foreground">
                    {playlists.find((p) => p.id === selectedPlaylistForAdd)
                      ?.name ?? "Playlist"}
                  </span>
                </p>
              </div>
            )}

            {/* Catalog track list */}
            <div className="overflow-y-auto max-h-[60vh] p-2">
              {isTracksLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full rounded-lg mb-1" />
                ))
              ) : tracks.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
                  <span className="text-2xl mb-2">🎵</span>
                  <p className="text-sm">Belum ada track di katalog.</p>
                  <p className="text-xs mt-1 opacity-70">
                    Ajukan track baru melalui halaman Musik.
                  </p>
                </div>
              ) : (
                tracks.map((track) => {
                  const isCurrentTrackPlaying =
                    currentTrack?.id === track.id && isPlaying;

                  return (
                    <div
                      key={track.id}
                      className="flex items-center gap-2 rounded-lg px-2 py-2 transition-colors hover:bg-muted/30"
                    >
                      {/* Play button */}
                      <button
                        type="button"
                        onClick={() => handlePlayCatalogTrack(track)}
                        className={cn(
                          "flex size-8 shrink-0 items-center justify-center rounded-full transition-colors",
                          isCurrentTrackPlaying
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted/50 text-muted-foreground hover:bg-primary/10 hover:text-primary",
                        )}
                      >
                        {isCurrentTrackPlaying ? (
                          <Pause className="size-3.5" />
                        ) : (
                          <Play className="size-3.5 ml-0.5" />
                        )}
                      </button>

                      {/* Track info */}
                      <div className="min-w-0 flex-1">
                        <p
                          className={cn(
                            "truncate text-xs font-medium",
                            isCurrentTrackPlaying && "text-primary",
                          )}
                        >
                          {track.title}
                        </p>
                        <p className="truncate text-[10px] text-muted-foreground">
                          {track.youtubeUrl}
                        </p>
                      </div>

                      {/* Add to playlist button */}
                      {selectedPlaylistForAdd && (
                        <button
                          type="button"
                          onClick={() =>
                            handleAddToPlaylist(selectedPlaylistForAdd, track)
                          }
                          className="flex size-7 shrink-0 items-center justify-center rounded-md text-muted-foreground hover:bg-primary/10 hover:text-primary"
                          title="Tambah ke playlist"
                        >
                          <Plus className="size-3.5" />
                        </button>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleAdd} className="mt-auto flex flex-col gap-2">
        <div className="flex gap-2">
          <input
            placeholder="Nama playlist"
            value={formCreatePlaylistMusic.name}
            onChange={(e) =>
              setFormCreatePlaylistMusic((prev) => ({
                ...prev,
                name: e.target.value,
              }))
            }
            className="flex-1 rounded-lg border border-input bg-background/80 px-3 py-1.5 text-sm outline-none focus:ring-1 focus:ring-ring"
            disabled={isPending}
          />
          <input
            placeholder="Keterangan"
            value={formCreatePlaylistMusic.description}
            onChange={(e) =>
              setFormCreatePlaylistMusic((prev) => ({
                ...prev,
                description: e.target.value,
              }))
            }
            className="flex-1 rounded-lg border border-input bg-background/80 px-3 py-1.5 text-sm outline-none focus:ring-1 focus:ring-ring"
            disabled={isPending}
          />
          <Button
            type="submit"
            size="sm"
            className="h-8 px-3 shrink-0"
            disabled={
              isPending ||
              !formCreatePlaylistMusic.name.trim() ||
              !formCreatePlaylistMusic.description.trim()
            }
          >
            <Plus className="size-4" />
          </Button>
        </div>
      </form>
    </GlassCard>
  );
}
