"use client";

import * as React from "react";
import { useMusicPlayer } from "@/context/MusicPlayerContext";
import { cn } from "@/utils/classname";
import {
  ChevronDown,
  ChevronUp,
  ListMusic,
  Music,
  Pause,
  Play,
  Shuffle,
  SkipBack,
  SkipForward,
  Square,
  X,
} from "lucide-react";
import type { IMusicPlayListItem } from "@repo/types";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function toEmbedUrl(url: string): string | null {
  try {
    const parsed = new URL(url);
    if (parsed.hostname.includes("youtube.com")) {
      const id = parsed.searchParams.get("v");
      return id
        ? `https://www.youtube.com/embed/${id}?enablejsapi=1&autoplay=0&origin=${encodeURIComponent(window.location.origin)}`
        : null;
    }
    if (parsed.hostname.includes("youtu.be")) {
      const id = parsed.pathname.slice(1);
      return id
        ? `https://www.youtube.com/embed/${id}?enablejsapi=1&autoplay=0&origin=${encodeURIComponent(window.location.origin)}`
        : null;
    }
    if (parsed.hostname.includes("spotify.com")) {
      const embed = url
        .replace("open.spotify.com/", "open.spotify.com/embed/")
        .split("?")[0];
      return `${embed}?theme=0`;
    }
    return null;
  } catch {
    return null;
  }
}

function sendPlayerCommand(
  iframe: HTMLIFrameElement,
  command: "playVideo" | "pauseVideo",
) {
  try {
    iframe.contentWindow?.postMessage(
      JSON.stringify({ event: "command", func: command, args: "" }),
      "*",
    );
  } catch {}
}

// Listen for YouTube iframe state changes via postMessage
function useYouTubeOnEnded(
  iframeRef: React.RefObject<HTMLIFrameElement | null>,
  onEnded: () => void,
) {
  React.useEffect(() => {
    const handler = (event: MessageEvent) => {
      try {
        const data =
          typeof event.data === "string" ? JSON.parse(event.data) : event.data;
        // YouTube sends { event: "onStateChange", info: 0 } when video ends
        if (data.event === "onStateChange" && data.info === 0) {
          onEnded();
        }
      } catch {
        // Not a YouTube message or not JSON
      }
    };

    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, [onEnded]);
}

function QueuePanel({
  queue,
  currentTrack,
  currentIndex,
  isShuffle,
  onPlay,
  onRemove,
  onClose,
}: {
  queue: IMusicPlayListItem[];
  currentTrack: IMusicPlayListItem | null;
  currentIndex: number;
  isShuffle: boolean;
  onPlay: (track: IMusicPlayListItem, index: number) => void;
  onRemove: (trackId: string) => void;
  onClose: () => void;
}) {
  return (
    <div className="border-t border-border/30 max-h-[300px] overflow-y-auto">
      <div className="flex items-center justify-between px-4 py-2">
        <div className="flex items-center gap-2">
          <ListMusic className="size-4 text-muted-foreground" />
          <span className="text-xs font-medium text-muted-foreground">
            Antrean {isShuffle && "(Acak)"}
          </span>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="size-5 rounded text-muted-foreground hover:text-foreground"
        >
          <X className="size-3.5" />
        </button>
      </div>
      {queue.length === 0 ? (
        <p className="px-4 pb-3 text-xs text-muted-foreground/70 italic">
          Antrean kosong
        </p>
      ) : (
        <div className="px-2 pb-2">
          {queue.map((track, idx) => {
            const isActive = currentTrack?.id === track.id;
            return (
              <div
                key={`${track.id}-${idx}`}
                className={cn(
                  "flex items-center gap-2 rounded-lg px-2 py-1.5 transition-colors",
                  isActive ? "bg-primary/10" : "hover:bg-muted/30",
                )}
              >
                <button
                  type="button"
                  onClick={() => onPlay(track, idx)}
                  className="size-5 shrink-0"
                >
                  {isActive ? (
                    <Music className="size-3 text-primary" />
                  ) : (
                    <span className="text-[10px] text-muted-foreground">
                      {idx + 1}
                    </span>
                  )}
                </button>
                <p
                  className={cn(
                    "min-w-0 flex-1 truncate text-xs",
                    isActive && "text-primary font-medium",
                  )}
                >
                  {track.title}
                </p>
                {!isActive && (
                  <button
                    type="button"
                    onClick={() => onRemove(track.id)}
                    className="size-4 shrink-0 rounded text-muted-foreground hover:text-destructive"
                  >
                    <X className="size-3" />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// FloatingMusicPlayer
// ---------------------------------------------------------------------------

export function FloatingMusicPlayer() {
  const {
    currentTrack,
    isPlaying,
    playlistName,
    queue,
    currentIndex,
    isShuffle,
    pause,
    play,
    stop,
    nextTrack,
    prevTrack,
    toggleShuffle,
    playPlaylist,
    removeFromQueue,
  } = useMusicPlayer();

  const [expanded, setExpanded] = React.useState(false);
  const [showQueue, setShowQueue] = React.useState(false);
  const iframeRef = React.useRef<HTMLIFrameElement>(null);
  const iframeReadyRef = React.useRef(false);
  const [embedUrl, setEmbedUrl] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (currentTrack?.youtubeUrl) {
      setEmbedUrl(toEmbedUrl(currentTrack.youtubeUrl));
    } else {
      setEmbedUrl(null);
    }
  }, [currentTrack?.youtubeUrl]);

  React.useEffect(() => {
    iframeReadyRef.current = false;
  }, [currentTrack?.id]);

  React.useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe || !currentTrack || !iframeReadyRef.current) return;
    sendPlayerCommand(iframe, isPlaying ? "playVideo" : "pauseVideo");
  }, [isPlaying, currentTrack?.id]);

  const handleEnded = React.useCallback(() => {
    setTimeout(() => nextTrack(), 500);
  }, [nextTrack]);

  useYouTubeOnEnded(iframeRef, handleEnded);

  const handleIframeLoad = () => {
    iframeReadyRef.current = true;
    if (isPlaying && iframeRef.current) {
      sendPlayerCommand(iframeRef.current, "playVideo");
    }
  };

  const handlePlay = () => {
    if (currentTrack) {
      play(currentTrack, playlistName);
    }
  };

  const handleQueuePlay = (track: IMusicPlayListItem, _index: number) => {
    play(track, playlistName);
  };

  const handleQueueRemove = (trackId: string) => {
    removeFromQueue(trackId);
  };

  if (!currentTrack) return null;

  return (
    <div
      className={cn(
        "fixed left-0 right-0 z-[60] border-t border-border/50 bg-background/95 backdrop-blur-xl transition-all duration-300",
        expanded
          ? "bottom-16 md:bottom-0 h-auto"
          : "h-16 bottom-16 md:bottom-0",
      )}
    >
      <div className="flex h-16 items-center gap-3 px-4">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Music className="size-5" />
        </div>

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium">{currentTrack.title}</p>
          {playlistName && (
            <p className="truncate text-xs text-muted-foreground">
              {playlistName}
            </p>
          )}
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={prevTrack}
            className="flex size-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted"
            title="Sebelumnya"
          >
            <SkipBack className="size-3.5" />
          </button>

          <button
            type="button"
            onClick={isPlaying ? pause : handlePlay}
            className="flex size-9 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors hover:bg-primary/20"
            title={isPlaying ? "Jeda" : "Putar"}
          >
            {isPlaying ? (
              <Pause className="size-4" />
            ) : (
              <Play className="size-4 ml-0.5" />
            )}
          </button>

          <button
            type="button"
            onClick={nextTrack}
            className="flex size-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted"
            title="Selanjutnya"
          >
            <SkipForward className="size-3.5" />
          </button>

          <button
            type="button"
            onClick={stop}
            className="flex size-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
            title="Hentikan"
          >
            <Square className="size-3" />
          </button>
          <button
            type="button"
            onClick={toggleShuffle}
            className={cn(
              "flex size-8 items-center justify-center rounded-full transition-colors",
              isShuffle
                ? "text-primary bg-primary/10"
                : "text-muted-foreground hover:bg-muted",
            )}
            title={isShuffle ? "Acak: Aktif" : "Acak: Mati"}
          >
            <Shuffle className="size-3.5" />
          </button>

          <button
            type="button"
            onClick={() => setShowQueue((v) => !v)}
            className={cn(
              "flex size-8 items-center justify-center rounded-full transition-colors",
              showQueue
                ? "text-primary bg-primary/10"
                : "text-muted-foreground hover:bg-muted",
            )}
            title="Antrean"
          >
            <ListMusic className="size-3.5" />
          </button>

          {embedUrl && (
            <button
              type="button"
              onClick={() => setExpanded((v) => !v)}
              className="flex size-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted"
              title={expanded ? "Kecilkan" : "Perbesar"}
            >
              {expanded ? (
                <ChevronDown className="size-4" />
              ) : (
                <ChevronUp className="size-4" />
              )}
            </button>
          )}
        </div>
      </div>

      {showQueue && (
        <QueuePanel
          queue={queue}
          currentTrack={currentTrack}
          currentIndex={currentIndex}
          isShuffle={isShuffle}
          onPlay={handleQueuePlay}
          onRemove={handleQueueRemove}
          onClose={() => setShowQueue(false)}
        />
      )}

      {embedUrl && (
        <div
          className={cn(
            "transition-all duration-300 overflow-hidden",
            expanded ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0",
          )}
        >
          <div className="border-t border-border/30 px-4 pb-4 pt-2">
            <div className="mx-auto aspect-video w-full max-w-2xl overflow-hidden rounded-xl bg-black/5">
              <iframe
                ref={iframeRef}
                key={currentTrack.id}
                src={embedUrl}
                title={currentTrack.title}
                className="h-full w-full"
                onLoad={handleIframeLoad}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
