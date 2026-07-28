import * as React from "react";
import { GlassCard } from "@/components/molecules/GlassCard";
import { WidgetHeader } from "@/components/atoms/WidgetHeader";
import { Music, Plus } from "lucide-react";
import { PlaylistItemCard } from "@/components/molecules/PlaylistItemCard";
import { Skeleton } from "@/components/atoms/Skeleton";
import { Button, Input } from "@/components/atoms";
import { PickCreatePlaylist } from "@repo/types";

interface MusicSectionProps {
  service: {
    handleAdd: (e: React.FormEvent) => void;
    createPlaylist: any;
  };
  state: {
    playlists: any[];
    isLoading: boolean;
    formCreatePlaylistMusic: PickCreatePlaylist;
    setFormCreatePlaylistMusic: React.Dispatch<
      React.SetStateAction<PickCreatePlaylist>
    >;
    activeId: string | null;
    setActiveId: React.Dispatch<React.SetStateAction<string | null>>;
  };
}

export function MusicSection({ service, state }: MusicSectionProps) {
  const { handleAdd, createPlaylist } = service;
  const {
    playlists,
    isLoading,
    formCreatePlaylistMusic,
    setFormCreatePlaylistMusic,
    activeId,
    setActiveId,
  } = state;

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
          playlists.map((playlist: any) => (
            <PlaylistItemCard
              key={playlist.id}
              playlist={playlist}
              isActive={playlist.id === activeId}
              onClick={() => setActiveId(playlist.id)}
            />
          ))
        )}
      </div>

      <form onSubmit={handleAdd} className="mt-auto flex flex-col gap-2">
        <Input
          placeholder="Nama playlist (mis. Lofi Ghibli)"
          value={formCreatePlaylistMusic.title}
          onChange={(e) =>
            setFormCreatePlaylistMusic((prev) => ({
              ...prev,
              title: e.target.value,
            }))
          }
          className="bg-background/50 h-9 border-transparent focus-visible:ring-1 text-sm"
          disabled={createPlaylist.isPending}
        />
        <div className="flex gap-2">
          <Input
            placeholder="URL Youtube..."
            value={formCreatePlaylistMusic.url}
            onChange={(e) =>
              setFormCreatePlaylistMusic((prev) => ({
                ...prev,
                url: e.target.value,
              }))
            }
            className="flex-1 bg-background/50 h-9 border-transparent focus-visible:ring-1 text-sm"
            disabled={createPlaylist.isPending}
          />
          <Button
            type="submit"
            size="sm"
            className="h-9 px-3 shrink-0"
            disabled={
              createPlaylist.isPending ||
              !formCreatePlaylistMusic.title.trim() ||
              !formCreatePlaylistMusic.url.trim()
            }
          >
            <Plus className="size-4" />
          </Button>
        </div>
      </form>
    </GlassCard>
  );
}
