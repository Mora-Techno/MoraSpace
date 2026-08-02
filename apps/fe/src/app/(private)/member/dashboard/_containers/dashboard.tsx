"use client";

import { useMemo, useState, useEffect } from "react";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import { MemberDashboardTemplate } from "@/components/templates/MemberDashboardTemplate";
import { DailyGreetingSection } from "@/components/organisms/DailyGreetingSection";
import { PomodoroSection } from "@/components/organisms/PomodoroSection";
import { TodoListSection } from "@/components/organisms/TodoListSection";
import { AgendaSection } from "@/components/organisms/AgendaSection";
import { MusicSection } from "@/components/organisms/MusicSection";
import { QuickNotesSection } from "@/components/organisms/QuickNotesSection";
import { loadAuthSession } from "@/utils/storage";
import { useApi } from "@/hooks/useApi/useApi";
import { useMusicPlayer } from "@/context/MusicPlayerContext";
import type {
  Note,
  PickCreateNote,
  PickCreatePlaylist,
  TrackCatalog,
  IMusicPlayListItem,
} from "@repo/types";

export default function DashboardContainer() {
  const api = useApi();
  const [name, setName] = useState("Member");
  const [greeting, setGreeting] = useState("Selamat Pagi");
  const [currentDate, setCurrentDate] = useState("");
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showCatalog, setShowCatalog] = useState<boolean>(false);

  const [expandedPlaylistId, setExpandedPlaylistId] = useState<string | null>(
    null,
  );
  const [selectedPlaylistForAdd, setSelectedPlaylistForAdd] = useState<
    string | null
  >(null);

  const toggleExpand = (id: string) => {
    setExpandedPlaylistId((prev) => (prev === id ? null : id));
  };

  useEffect(() => {
    const session = loadAuthSession() as any;
    if (session?.fullName) {
      setName(session.fullName);
    } else if (session?.user?.name) {
      setName(session.user.name);
    }

    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Selamat Pagi");
    else if (hour < 15) setGreeting("Selamat Siang");
    else if (hour < 18) setGreeting("Selamat Sore");
    else setGreeting("Selamat Malam");

    setCurrentDate(
      format(new Date(), "EEEE, d MMMM yyyy", { locale: idLocale }),
    );
  }, []);

  // Todo
  const useTodoEntry = api.todo;
  const useTodo = useTodoEntry.query.get({ status: "pending" });
  const useTodoUpdate = useTodoEntry.mutate.update();
  const useTodoCreate = useTodoEntry.mutate.create();

  const { data: pendingTodosOverview = [] } = useTodo;
  const updateTodo = useTodoUpdate;
  const createTodo = useTodoCreate;
  const [newTaskText, setNewTaskText] = useState("");

  const Todos = pendingTodosOverview
    .filter((t) => t.status !== "completed")
    .slice(0, 7);

  const uncompletedTodosCount = pendingTodosOverview.filter(
    (t) => t.status === "pending",
  ).length;

  const handleToggleTodo = (id: string, checked: boolean) => {
    updateTodo.mutate({
      id: { id },
      payload: { status: checked ? "completed" : "pending" },
    });
  };

  const handleAddTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskText.trim()) return;
    createTodo.mutate(
      { text: newTaskText.trim() },
      { onSuccess: () => setNewTaskText("") },
    );
  };

  const useCalenderEntry = api.calender;
  const now = new Date();

  const useCalender = useCalenderEntry.query.getCalender({
    month: String(now.getMonth() + 1).padStart(2, "0"),
    year: String(now.getFullYear()),
  });

  const { data: events = [], isLoading: calendarLoading } = useCalender;

  const upcomingEvents = events
    .filter((e) => new Date(e.startDate) >= now)
    .sort(
      (a, b) =>
        new Date(a.startDate).getTime() - new Date(b.startDate).getTime(),
    )
    .slice(0, 4);

  const stats = useMemo(
    () => ({
      completedTodos: uncompletedTodosCount,
      pomodoroMinutes: 0,
      totalMeetings: events.filter(
        (e) => new Date(e.startDate).getDate() === now.getDate(),
      ).length,
    }),
    [uncompletedTodosCount, events, now.getDate()],
  );

  const usePodomoroEntry = api.pomodoro;

  const useStartSession = usePodomoroEntry.mutate.start();
  const useStopSession = usePodomoroEntry.mutate.stop();
  const startSession = useStartSession;
  const stopSession = useStopSession;

  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(25 * 60);
  const [isActive, setIsActive] = useState<boolean>(false);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      setIsFocused(false);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft]);

  const handleToggleFocus = (val: boolean) => {
    setIsFocused(val);
  };

  const handleStartPomodoro = () => {
    setIsActive(true);
    startSession.mutate({ metadata: { type: "work", duration: 25 * 60 } });
  };

  const handlePausePomodoro = () => {
    setIsActive(false);
  };

  const handleStopPomodoro = () => {
    setIsActive(false);
    setTimeLeft(25 * 60);
    stopSession.mutate({ duration: 25 * 60 - timeLeft });
  };

  const pomodoroMinutes = Math.floor(timeLeft / 60);
  const pomodoroSeconds = timeLeft % 60;

  // Music
  const useMusicEntry = api.music;
  const useMusicPlaylist = useMusicEntry.query.getPlayList();
  const useCreatePlaylistMusic = useMusicEntry.mutate.create();
  const useAddItemMusic = useMusicEntry.mutate.addItem();
  const useDeleteItemMusic = useMusicEntry.mutate.deleteItem();

  const { data: playlists = [], isLoading: musicLoading } = useMusicPlaylist;

  const mappedPlaylists = useMemo(() => {
    return playlists.map((playlist) => ({
      ...playlist,
      items: (playlist.items ?? []).map((item) => ({
        ...item,
        title: item.title || item.trackCatalog?.title || "",
        youtubeUrl: item.youtubeUrl || item.trackCatalog?.youtubeUrl || "",
      })),
    }));
  }, [playlists]);

  const createPlaylist = useCreatePlaylistMusic;

  // Track Catalog
  const useTrackCatalogEntry = api.trackCatalog;
  const { data: trackCatalogTracks = [], isLoading: tracksLoading } =
    useTrackCatalogEntry.query.list();

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

  const [formCreatePlaylistMusic, setFormCreatePlaylistMusic] =
    useState<PickCreatePlaylist>({
      name: "",
      description: "",
    });

  const handleAddPlaylist = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !formCreatePlaylistMusic.name.trim() ||
      !formCreatePlaylistMusic.description.trim()
    )
      return;
    createPlaylist.mutate(formCreatePlaylistMusic);
  };

  const handleAddMusicItem = (playlistId: string, trackCatalogId: string) => {
    const payload = { playlistId, trackCatalogId };

    useAddItemMusic.mutate(payload);
  };

  const handleDeleteMusicItem = (playlistId: string, itemId: string) => {
    useDeleteItemMusic.mutate({ playlistId, itemId });
  };

  const musicPlayer = useMusicPlayer();
  const noteApi = api.note;
  const { data: notes = [], isLoading: notesLoading } = noteApi.query.get();
  const createNote = noteApi.mutate.create();
  const updateNote = noteApi.mutate.update();
  const deleteNote = noteApi.mutate.delete();

  const [formCreateNote, setFormCreateNote] = useState<PickCreateNote>({
    title: "",
    content: "",
  });
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [formEditNote, setFormEditNote] = useState<PickCreateNote>({
    title: "",
    content: "",
  });

  useEffect(() => {
    if (selectedNote) {
      setFormEditNote({
        title: selectedNote.title,
        content: selectedNote.content,
      });
    }
  }, [selectedNote]);

  const recentNotes = notes.slice(0, 3);

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formCreateNote.title.trim() || !formCreateNote.content.trim()) return;
    createNote.mutate(
      {
        title: formCreateNote.title.trim(),
        content: formCreateNote.content.trim(),
      },
      {
        onSuccess: () => {
          setFormCreateNote({ title: "", content: "" });
        },
      },
    );
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !selectedNote ||
      !formEditNote.title.trim() ||
      !formEditNote.content.trim()
    )
      return;
    updateNote.mutate(
      {
        id: { id: selectedNote.id },
        payload: {
          title: formEditNote.title.trim(),
          content: formEditNote.content.trim(),
        },
      },
      { onSuccess: () => setSelectedNote(null) },
    );
  };

  const handleDeleteNote = () => {
    if (!selectedNote) return;
    deleteNote.mutate(selectedNote.id, {
      onSuccess: () => setSelectedNote(null),
    });
  };

  return (
    <div
      className={`transition-all duration-700 ${isFocused ? "ring-4 ring-primary/20 bg-background/50" : ""}`}
    >
      {isFocused && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 pointer-events-none transition-all duration-700" />
      )}

      <div className={isFocused ? "relative z-50" : ""}>
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
                handleStart: handleStartPomodoro,
                handlePause: handlePausePomodoro,
                handleStop: handleStopPomodoro,
                handleToggleFocus,
              }}
              state={{
                isFocused,
                isActive,
                minutes: pomodoroMinutes,
                seconds: pomodoroSeconds,
                isStartPending: startSession.isPending,
                isStopPending: stopSession.isPending,
              }}
            />
          }
          todoList={
            <TodoListSection
              service={{
                handleToggle: handleToggleTodo,
                handleAdd: handleAddTodo,
                updateTodo,
                createTodo,
              }}
              state={{
                Todos,
                uncompletedTodosCount,
                isLoading: useTodo.isPending,
                newTaskText,
                setNewTaskText,
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
                handleAdd: handleAddPlaylist,
                isPending: createPlaylist.isPending,
                addItem: handleAddMusicItem,
                deleteItem: handleDeleteMusicItem,
              }}
              state={{
                playlists: mappedPlaylists,
                isLoading: musicLoading,
                formCreatePlaylistMusic,
                expandedPlaylistId,
                setFormCreatePlaylistMusic,
                currentTrack: musicPlayer.currentTrack,
                isPlaying: musicPlayer.isPlaying,
                queue: musicPlayer.queue,
                isShuffle: musicPlayer.isShuffle,
                onPlayPlaylist: musicPlayer.playPlaylist,
                onTogglePlay: musicPlayer.toggle,
                onPause: musicPlayer.pause,
                onToggleShuffle: musicPlayer.toggleShuffle,
                onAddToQueue: musicPlayer.addToQueue,
                setShowModal,
                showModal,
                setShowCatalog,
                showCatalog,
                toggleExpand,
                selectedPlaylistForAdd,
                setSelectedPlaylistForAdd,
                tracks: trackCatalogTracks,
                isTracksLoading: tracksLoading,
                onPlayTrack: handlePlayCatalogTrack,
              }}
            />
          }
          quickNotes={
            <QuickNotesSection
              service={{
                handleAdd: handleAddNote,
                handleSaveEdit,
                handleDeleteNote,
                createNote,
                updateNote,
                deleteNote,
              }}
              state={{
                recentNotes,
                isLoading: notesLoading,
                formCreateNote,
                setFormCreateNote,
                selectedNote,
                setSelectedNote,
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
