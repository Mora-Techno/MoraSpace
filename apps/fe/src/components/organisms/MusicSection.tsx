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
import { Button, Input } from "@/components/atoms";
import type {
  PickCreatePlaylist,
  MusicPlaylist,
  IMusicPlayListItem,
  TrackCatalog,
} from "@repo/types";
import { cn } from "@/utils/classname";
import PlaylistModal from "../molecules/modal/PlayListModal";
import CatalogModal from "../molecules/modal/CatalogModal";

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
    showModalPlayList: boolean;
    setShowModalPlayList: React.Dispatch<React.SetStateAction<boolean>>;
    showCatalog: boolean;
    setShowCatalog: React.Dispatch<React.SetStateAction<boolean>>;
    expandedPlaylistId: string | null;

    selectedPlaylistForAdd: string | null;
    setSelectedPlaylistForAdd: React.Dispatch<
      React.SetStateAction<string | null>
    >;
    formCreatePlaylistMusic: PickCreatePlaylist;
    setFormCreatePlaylistMusic: React.Dispatch<
      React.SetStateAction<PickCreatePlaylist>
    >;

    currentTrack: IMusicPlayListItem | null;
    isPlaying: boolean;

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

    isTracksLoading?: boolean;
    onPlayTrack?: (track: TrackCatalog) => void;
    toggleExpand: (id: string) => void;
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
    showModalPlayList,
    setShowModalPlayList,
    selectedPlaylistForAdd,
    setSelectedPlaylistForAdd,
    setShowCatalog,
    showCatalog,
    expandedPlaylistId,
    isShuffle,
    onPlayPlaylist,
    onTogglePlay,
    onPause,
    onToggleShuffle,
    onAddToQueue,

    isTracksLoading = false,
    onPlayTrack,
    toggleExpand,
  } = state;

  return (
    <GlassCard className="p-6 flex flex-col h-105" data-stagger-item>
      <div className="w-full flex  justify-between items-start">
        <WidgetHeader title="Teman Fokus" icon={<Music className="size-5" />} />
        <Button
          size="sm"
          className="h-8 px-3 shrink-0"
          type="button"
          onClick={() => {
            setShowModalPlayList(true);
          }}
        >
          <Plus className="size-4" />
        </Button>
      </div>

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

        <PlaylistModal
          formCreatePlaylistMusic={formCreatePlaylistMusic}
          onOpenChange={setShowModalPlayList}
          open={showModalPlayList}
          setFormCreatePlaylistMusic={setFormCreatePlaylistMusic}
          handleAdd={handleAdd}
          isPending={isPending}
        />
      </div>

      <CatalogModal
        addItem={addItem}
        currentTrack={currentTrack}
        isPlaying={isPlaying}
        onOpenChange={setShowCatalog}
        open={showCatalog}
        playlists={playlists}
        selectedPlaylistForAdd={selectedPlaylistForAdd}
        isTracksLoading={isTracksLoading}
        onPlayTrack={onPlayTrack}
      />
    </GlassCard>
  );
}
