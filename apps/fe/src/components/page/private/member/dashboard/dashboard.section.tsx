'use client';

import type {
  IMusicPlayListItem,
  MusicPlaylist,
  Note,
  PickCreateNote,
  PickCreatePlaylist,
  PickUpdateTodo,
  Todo,
  TrackCatalog,
} from '@repo/types';

import { AgendaSection } from '@/components/organisms/AgendaSection';
import { DailyGreetingSection } from '@/components/organisms/DailyGreetingSection';
import { MusicSection } from '@/components/organisms/MusicSection';
import { PomodoroSection } from '@/components/organisms/PomodoroSection';
import { QuickNotesSection } from '@/components/organisms/QuickNotesSection';
import { TodoListSection } from '@/components/organisms/TodoListSection';
import { MemberDashboardTemplate } from '@/components/templates/MemberDashboardTemplate';
import type { useCreateNote, useUpdateNote } from '@/hooks/useApi/note/state/mutate';
import type { useCreateTodo } from '@/hooks/useApi/todo';
import type { AlertContexType } from '@/types/ui';

interface DashboardSectionProps {
  service: {
    stats: {
      pendingTodos: number;
      pomodoroMinutes: number;
      totalMeetings: number;
    };
    todos: Todo[];
    uncompletedTodosCount: number;
    todoLoading: boolean;
    todoPending: boolean;
    createTodo: ReturnType<typeof useCreateTodo>;
    onToggleTodo: (id: string, checked: boolean) => void;
    onAddTodo: (e: React.FormEvent) => void;
    onDeleteTodo: (id: string) => void;
    onSelectTodo: (id: string) => void;
    alert: AlertContexType;
    upcomingEvents: any[];
    calendarLoading: boolean;
    onStartPomodoro: () => void;
    onPausePomodoro: () => void;
    onStopPomodoro: () => void;
    onToggleFocus: (val: boolean) => void;
    isStartPending: boolean;
    isStopPending: boolean;
    playlists: MusicPlaylist[];
    musicLoading: boolean;
    createPlaylistPending: boolean;
    tracks: TrackCatalog[];
    tracksLoading: boolean;
    onAddPlaylist: (e: React.FormEvent) => void;
    onAddMusicItem: (playlistId: string, trackCatalogId: string) => void;
    onDeleteMusicItem: (playlistId: string, itemId: string) => void;
    onPlayCatalogTrack: (track: TrackCatalog) => void;
    currentTrack: IMusicPlayListItem | null;
    isPlaying: boolean;
    isShuffle: boolean;
    onPlayPlaylist: (
      tracks: IMusicPlayListItem[],
      startIndex?: number,
      playlistName?: string,
    ) => void;
    onTogglePlay: (track?: IMusicPlayListItem, playlistName?: string) => void;
    onPausePlayer: () => void;
    onToggleShuffle: () => void;
    onAddToQueue: (track: IMusicPlayListItem) => void;
    onToggleExpand: (id: string) => void;
    recentNotes: Note[];
    notesLoading: boolean;
    createNote: ReturnType<typeof useCreateNote>;
    updateNote: ReturnType<typeof useUpdateNote>;
    onAddNote: (e: React.FormEvent) => void;
    onSaveEditNote: (e: React.FormEvent) => void;
    onDeleteNote: () => void;
  };
  state: {
    name: string;
    greeting: string;
    currentDate: string;
    isFocused: boolean;
    isActive: boolean;
    pomodoroMinutes: number;
    pomodoroSeconds: number;
    showModalTodo: boolean;
    setShowModalTodo: React.Dispatch<React.SetStateAction<boolean>>;
    formUpdateTodo: PickUpdateTodo;
    setFormUpdateTodo: React.Dispatch<React.SetStateAction<PickUpdateTodo>>;
    showModalPlayList: boolean;
    setShowModalPlayList: React.Dispatch<React.SetStateAction<boolean>>;
    showModalNotes: boolean;
    setShowModalNotes: React.Dispatch<React.SetStateAction<boolean>>;
    showCatalog: boolean;
    setShowCatalog: React.Dispatch<React.SetStateAction<boolean>>;
    expandedPlaylistId: string | null;
    selectedPlaylistForAdd: string | null;
    setSelectedPlaylistForAdd: React.Dispatch<React.SetStateAction<string | null>>;
    formCreatePlaylistMusic: PickCreatePlaylist;
    setFormCreatePlaylistMusic: React.Dispatch<React.SetStateAction<PickCreatePlaylist>>;
    formCreateNote: PickCreateNote;
    setFormCreateNote: React.Dispatch<React.SetStateAction<PickCreateNote>>;
    selectedNote: Note | null;
    setSelectedNote: React.Dispatch<React.SetStateAction<Note | null>>;
    formEditNote: PickCreateNote;
    setFormEditNote: React.Dispatch<React.SetStateAction<PickCreateNote>>;
  };
}

export function DashboardSection({ service, state }: DashboardSectionProps) {
  const {
    stats,
    todos,
    uncompletedTodosCount,
    todoLoading,
    todoPending,
    createTodo,
    onToggleTodo,
    onAddTodo,
    onDeleteTodo,
    onSelectTodo,
    alert,
    upcomingEvents,
    calendarLoading,
    onStartPomodoro,
    onPausePomodoro,
    onStopPomodoro,
    onToggleFocus,
    isStartPending,
    isStopPending,
    playlists,
    musicLoading,
    createPlaylistPending,
    tracks,
    tracksLoading,
    onAddPlaylist,
    onAddMusicItem,
    onDeleteMusicItem,
    onPlayCatalogTrack,
    currentTrack,
    isPlaying,
    isShuffle,
    onPlayPlaylist,
    onTogglePlay,
    onPausePlayer,
    onToggleShuffle,
    onAddToQueue,
    onToggleExpand,
    recentNotes,
    notesLoading,
    createNote,
    updateNote,
    onAddNote,
    onSaveEditNote,
    onDeleteNote,
  } = service;
  const {
    name,
    greeting,
    currentDate,
    isFocused,
    isActive,
    pomodoroMinutes,
    pomodoroSeconds,
    showModalTodo,
    setShowModalTodo,
    formUpdateTodo,
    setFormUpdateTodo,
    showModalPlayList,
    setShowModalPlayList,
    showModalNotes,
    setShowModalNotes,
    showCatalog,
    setShowCatalog,
    expandedPlaylistId,
    selectedPlaylistForAdd,
    setSelectedPlaylistForAdd,
    formCreatePlaylistMusic,
    setFormCreatePlaylistMusic,
    formCreateNote,
    setFormCreateNote,
    selectedNote,
    setSelectedNote,
    formEditNote,
    setFormEditNote,
  } = state;

  return (
    <div
      className={`transition-all duration-700 ${isFocused ? 'ring-4 ring-primary/20 bg-background/50' : ''}`}
    >
      {isFocused && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 pointer-events-none transition-all duration-700" />
      )}

      <div className={isFocused ? 'relative z-50' : ''}>
        <MemberDashboardTemplate
          dailyGreeting={
            <DailyGreetingSection
              state={{
                name,
                greeting,
                currentDate,
                stats,
              }}
            />
          }
          pomodoro={
            <PomodoroSection
              service={{
                handleStart: onStartPomodoro,
                handlePause: onPausePomodoro,
                handleStop: onStopPomodoro,
                handleToggleFocus: onToggleFocus,
              }}
              state={{
                isFocused,
                isActive,
                minutes: pomodoroMinutes,
                seconds: pomodoroSeconds,
                isStartPending,
                isStopPending,
              }}
            />
          }
          todoList={
            <TodoListSection
              service={{
                handleToggle: onToggleTodo,
                handleAdd: onAddTodo,
                handleDeleteTodo: onDeleteTodo,
                handleSelectTodo: onSelectTodo,
                isPending: todoPending,
                createTodo,
              }}
              state={{
                Todos: todos,
                uncompletedTodosCount,
                isLoading: todoLoading,
                formUpdateTodo,
                alert,
                setShowModalTodo,
                showModalTodo,
                setFormUpdateTodo,
              }}
            />
          }
          agenda={
            <AgendaSection
              state={{
                upcomingEvents,
                isLoading: calendarLoading,
              }}
            />
          }
          music={
            <MusicSection
              service={{
                handleAdd: onAddPlaylist,
                isPending: createPlaylistPending,
                addItem: onAddMusicItem,
                track: tracks,
                deleteItem: onDeleteMusicItem,
              }}
              state={{
                playlists,
                isLoading: musicLoading,
                formCreatePlaylistMusic,
                expandedPlaylistId,
                setFormCreatePlaylistMusic,
                currentTrack,
                isPlaying,
                isShuffle,
                onPlayPlaylist,
                onTogglePlay,
                onPause: onPausePlayer,
                onToggleShuffle,
                onAddToQueue,
                setShowModalPlayList,
                showModalPlayList,
                setShowCatalog,
                showCatalog,
                toggleExpand: onToggleExpand,
                selectedPlaylistForAdd,
                setSelectedPlaylistForAdd,
                isTracksLoading: tracksLoading,
                onPlayTrack: onPlayCatalogTrack,
              }}
            />
          }
          quickNotes={
            <QuickNotesSection
              service={{
                handleAdd: onAddNote,
                handleSaveEdit: onSaveEditNote,
                handleDeleteNote: onDeleteNote,
                createNote,
                updateNote,
              }}
              state={{
                recentNotes,
                isLoading: notesLoading,
                formCreateNote,
                setFormCreateNote,
                selectedNote,
                setShowModalNotes,
                showModalNotes,
                setSelectedNote,
                alertType: alert,
                formEditNote,
                setFormEditNote,
              }}
            />
          }
        />
      </div>
    </div>
  );
}

export default DashboardSection;
