import * as React from "react";
import { MusicPlaylist } from "@repo/types";
import { PlayCircle } from "lucide-react";
import { cn } from "@/utils/classname";

interface PlaylistItemCardProps {
  playlist: MusicPlaylist;
  onClick: () => void;
  isActive?: boolean;
}

export function PlaylistItemCard({
  playlist,
  onClick,
  isActive,
}: PlaylistItemCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-3 rounded-xl p-3 text-left transition-colors hover:bg-muted/50",
        isActive && "bg-primary/10 text-primary",
      )}
    >
      <PlayCircle
        className={cn(
          "size-8 shrink-0 text-muted-foreground",
          isActive && "text-primary",
        )}
      />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{playlist.title}</p>
        {/* You can display the host/domain or just let it be clean */}
      </div>
    </button>
  );
}
