"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
} from "react";
import type { IMusicPlayListItem } from "@repo/types";

export interface MusicPlayerState {
  /** The track currently playing (null = nothing playing) */
  currentTrack: IMusicPlayListItem | null;
  /** Whether the player is actively playing */
  isPlaying: boolean;
  /** Playlist name for display */
  playlistName: string;

  // ── Queue ──
  /** Current playback queue (may be shuffled) */
  queue: IMusicPlayListItem[];
  /** Original unshuffled queue order — preserved so toggling shuffle off restores order */
  originalQueue: IMusicPlayListItem[];
  /** Previously played tracks (for "Previous" navigation) */
  history: IMusicPlayListItem[];

  // ── Shuffle ──
  /** Whether shuffle mode is active */
  isShuffle: boolean;

  /** Current index within `queue` that points to `currentTrack` */
  currentIndex: number;
}

export interface MusicPlayerContextValue extends MusicPlayerState {
  // ── Core ──
  /** Play a single track (legacy — use playPlaylist for full queue support) */
  play: (track: IMusicPlayListItem, playlistName?: string) => void;
  /** Pause the current track */
  pause: () => void;
  /** Stop playback entirely and clear queue */
  stop: () => void;
  /** Toggle play/pause on the current track */
  toggle: (track?: IMusicPlayListItem, playlistName?: string) => void;

  // ── Queue ──
  /**
   * Start playing a playlist from a specific index.
   * Populates the queue and starts playback immediately.
   */
  playPlaylist: (
    tracks: IMusicPlayListItem[],
    startIndex?: number,
    playlistName?: string,
  ) => void;
  /** Append a track to the end of the queue */
  addToQueue: (track: IMusicPlayListItem) => void;
  /** Insert a track immediately after the currently playing track */
  playNext: (track: IMusicPlayListItem) => void;
  /** Remove a track from the queue by its ID */
  removeFromQueue: (trackId: string) => void;
  /** Clear the entire queue (keeps current track playing) */
  clearQueue: () => void;

  // ── Navigation ──
  /** Advance to the next track in the queue */
  nextTrack: () => void;
  /** Go back to the previous track in history */
  prevTrack: () => void;

  // ── Shuffle ──
  /** Toggle shuffle mode on/off */
  toggleShuffle: () => void;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Fisher-Yates (Knuth) shuffle — returns a new array, never mutates input */
function fisherYatesShuffle<T>(arr: T[]): T[] {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/**
 * Build a shuffled queue that guarantees every track is played at least once
 * before any repeats.  The current track is always placed at index 0.
 */
function buildShuffledQueue(
  tracks: IMusicPlayListItem[],
  currentId: string,
): IMusicPlayListItem[] {
  const others = tracks.filter((t) => t.id !== currentId);
  const current = tracks.find((t) => t.id === currentId)!;
  return [current, ...fisherYatesShuffle(others)];
}

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

const MusicPlayerContext = createContext<MusicPlayerContextValue | null>(null);

const initialState: MusicPlayerState = {
  currentTrack: null,
  isPlaying: false,
  playlistName: "",

  queue: [],
  originalQueue: [],
  history: [],

  isShuffle: false,
  currentIndex: -1,
};

export function MusicPlayerProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [state, setState] = useState<MusicPlayerState>(initialState);

  // Ref to avoid stale closures in callbacks
  const stateRef = useRef(state);
  stateRef.current = state;

  // ── Core actions ────────────────────────────────────────────────────────

  const play = useCallback((track: IMusicPlayListItem, playlistName = "") => {
    setState((prev) => {
      // If this track is already in the queue, just jump to it
      const idx = prev.queue.findIndex((t) => t.id === track.id);
      if (idx !== -1) {
        return {
          ...prev,
          currentTrack: track,
          isPlaying: true,
          playlistName: playlistName || prev.playlistName,
          currentIndex: idx,
        };
      }
      // Otherwise replace the queue with just this track
      return {
        ...prev,
        currentTrack: track,
        isPlaying: true,
        playlistName,
        queue: [track],
        originalQueue: [track],
        history: [],
        currentIndex: 0,
      };
    });
  }, []);

  const pause = useCallback(() => {
    setState((prev) => ({ ...prev, isPlaying: false }));
  }, []);

  const stop = useCallback(() => {
    setState(initialState);
  }, []);

  const toggle = useCallback(
    (track?: IMusicPlayListItem, playlistName = "") => {
      const s = stateRef.current;
      if (track && s.currentTrack?.id === track.id) {
        // Same track — toggle play/pause
        setState((prev) => ({ ...prev, isPlaying: !prev.isPlaying }));
      } else if (track) {
        // Different track — start playing
        setState((prev) => {
          const idx = prev.queue.findIndex((t) => t.id === track.id);
          if (idx !== -1) {
            return {
              ...prev,
              currentTrack: track,
              isPlaying: true,
              playlistName: playlistName || prev.playlistName,
              currentIndex: idx,
            };
          }
          return {
            ...prev,
            currentTrack: track,
            isPlaying: true,
            playlistName,
            queue: [track],
            originalQueue: [track],
            history: [],
            currentIndex: 0,
          };
        });
      } else {
        // No track passed — toggle current
        setState((prev) => ({ ...prev, isPlaying: !prev.isPlaying }));
      }
    },
    [],
  );

  // ── Queue actions ───────────────────────────────────────────────────────

  const playPlaylist = useCallback(
    (tracks: IMusicPlayListItem[], startIndex = 0, playlistName = "") => {
      if (tracks.length === 0) return;
      const s = stateRef.current;
      const startTrack = tracks[startIndex];

      const newQueue = s.isShuffle
        ? buildShuffledQueue(tracks, startTrack.id)
        : [...tracks];

      setState((prev) => ({
        ...prev,
        currentTrack: startTrack,
        isPlaying: true,
        playlistName,
        queue: newQueue,
        originalQueue: [...tracks],
        history: [],
        currentIndex: s.isShuffle ? 0 : startIndex,
      }));
    },
    [],
  );

  const addToQueue = useCallback((track: IMusicPlayListItem) => {
    setState((prev) => ({
      ...prev,
      queue: [...prev.queue, track],
      originalQueue: [...prev.originalQueue, track],
    }));
  }, []);

  const playNext = useCallback((track: IMusicPlayListItem) => {
    setState((prev) => {
      const insertAt = prev.currentIndex + 1;
      const newQueue = [
        ...prev.queue.slice(0, insertAt),
        track,
        ...prev.queue.slice(insertAt),
      ];
      const newOriginal = [
        ...prev.originalQueue.slice(0, prev.currentIndex + 1),
        track,
        ...prev.originalQueue.slice(prev.currentIndex + 1),
      ];
      return { ...prev, queue: newQueue, originalQueue: newOriginal };
    });
  }, []);

  const removeFromQueue = useCallback((trackId: string) => {
    setState((prev) => {
      // Don't remove the currently playing track
      if (prev.currentTrack?.id === trackId) return prev;

      const idx = prev.queue.findIndex((t) => t.id === trackId);
      if (idx === -1) return prev;

      const newQueue = prev.queue.filter((t) => t.id !== trackId);
      const newOriginal = prev.originalQueue.filter((t) => t.id !== trackId);

      // Adjust currentIndex if the removed item was before the current index
      const newCurrentIndex =
        idx < prev.currentIndex ? prev.currentIndex - 1 : prev.currentIndex;

      return {
        ...prev,
        queue: newQueue,
        originalQueue: newOriginal,
        currentIndex: newCurrentIndex,
      };
    });
  }, []);

  const clearQueue = useCallback(() => {
    setState((prev) => ({
      ...prev,
      queue: prev.currentTrack ? [prev.currentTrack] : [],
      originalQueue: prev.currentTrack ? [prev.currentTrack] : [],
      currentIndex: prev.currentTrack ? 0 : -1,
    }));
  }, []);

  // ── Navigation ──────────────────────────────────────────────────────────

  const nextTrack = useCallback(() => {
    setState((prev) => {
      if (!prev.currentTrack || prev.queue.length === 0) return prev;

      // Push current track to history
      const newHistory = [...prev.history, prev.currentTrack];

      const nextIdx = prev.currentIndex + 1;

      // If we've reached the end of the queue, loop back to the start
      if (nextIdx >= prev.queue.length) {
        const firstTrack = prev.isShuffle
          ? buildShuffledQueue(prev.queue, prev.queue[0].id)[0]
          : prev.queue[0];
        return {
          ...prev,
          currentTrack: firstTrack,
          isPlaying: true,
          history: newHistory,
          currentIndex: 0,
        };
      }

      return {
        ...prev,
        currentTrack: prev.queue[nextIdx],
        isPlaying: true,
        history: newHistory,
        currentIndex: nextIdx,
      };
    });
  }, []);

  const prevTrack = useCallback(() => {
    setState((prev) => {
      if (prev.history.length === 0) return prev;

      const newHistory = [...prev.history];
      const previousTrack = newHistory.pop()!;

      // Try to find the previous track in the queue to maintain index
      const idxInQueue = prev.queue.findIndex((t) => t.id === previousTrack.id);

      return {
        ...prev,
        currentTrack: previousTrack,
        isPlaying: true,
        history: newHistory,
        currentIndex: idxInQueue !== -1 ? idxInQueue : prev.currentIndex,
      };
    });
  }, []);

  // ── Shuffle ─────────────────────────────────────────────────────────────

  const toggleShuffle = useCallback(() => {
    setState((prev) => {
      const turningOn = !prev.isShuffle;

      if (turningOn) {
        // Shuffle ON — randomize the queue, keep current track at position 0
        if (!prev.currentTrack) {
          return { ...prev, isShuffle: true };
        }
        const shuffled = buildShuffledQueue(
          prev.originalQueue.length > 0 ? prev.originalQueue : prev.queue,
          prev.currentTrack.id,
        );
        return {
          ...prev,
          isShuffle: true,
          queue: shuffled,
          currentIndex: 0,
        };
      }

      // Shuffle OFF — restore original order
      if (!prev.currentTrack) {
        return { ...prev, isShuffle: false, queue: [...prev.originalQueue] };
      }
      const currentId = prev.currentTrack.id;
      const newIdx = prev.originalQueue.findIndex((t) => t.id === currentId);
      return {
        ...prev,
        isShuffle: false,
        queue: [...prev.originalQueue],
        currentIndex: newIdx !== -1 ? newIdx : 0,
      };
    });
  }, []);

  // ── Value ───────────────────────────────────────────────────────────────

  const value: MusicPlayerContextValue = {
    ...state,
    play,
    pause,
    stop,
    toggle,
    playPlaylist,
    addToQueue,
    playNext,
    removeFromQueue,
    clearQueue,
    nextTrack,
    prevTrack,
    toggleShuffle,
  };

  return (
    <MusicPlayerContext.Provider value={value}>
      {children}
    </MusicPlayerContext.Provider>
  );
}

export function useMusicPlayer() {
  const ctx = useContext(MusicPlayerContext);
  if (!ctx) {
    throw new Error("useMusicPlayer must be used within a MusicPlayerProvider");
  }
  return ctx;
}
