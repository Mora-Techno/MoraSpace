import { Skeleton } from "@/components/atoms";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/atoms/Dialog";
import { cn } from "@/utils/classname";
import { MusicPlaylist, TrackCatalog } from "@repo";
import { Disc3, Pause, Play, Plus } from "lucide-react";

interface CatalogModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedPlaylistForAdd: string | null;
  playlists: MusicPlaylist[];
  isTracksLoading?: boolean;
  tracks?: TrackCatalog[];
  onPlayTrack?: (track: TrackCatalog) => void;
  addItem: (playlistId: string, trackCatalogId: string) => void;
  isPlaying: any;
  currentTrack: { id: string } | null;
}

const CatalogModal: React.FC<CatalogModalProps> = ({
  onOpenChange,
  open,
  selectedPlaylistForAdd,
  playlists,
  isTracksLoading,
  onPlayTrack,
  currentTrack,
  addItem,
  isPlaying,
  tracks = [],
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="ghibli-glass sm:max-w-md p-0 overflow-hidden">
        <DialogHeader className="border-b border-border/30 px-4 py-3">
          <DialogTitle className="font-serif text-lg font-semibold flex items-center gap-2">
            <Disc3 className="size-4 text-primary" />
            Katalog Track
          </DialogTitle>
        </DialogHeader>

        {selectedPlaylistForAdd && (
          <div className="border-b border-border/20 bg-primary/5 px-4 py-2">
            <p className="text-xs text-muted-foreground">
              Menambah ke:{" "}
              <span className="font-medium text-foreground">
                {playlists.find((p) => p.id === selectedPlaylistForAdd)?.name ??
                  "Playlist"}
              </span>
            </p>
          </div>
        )}

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
                  <button
                    type="button"
                    onClick={() => onPlayTrack?.(track)}
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

                  {selectedPlaylistForAdd && (
                    <button
                      type="button"
                      onClick={() => addItem(selectedPlaylistForAdd, track.id)}
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
      </DialogContent>
    </Dialog>
  );
};

export default CatalogModal;
