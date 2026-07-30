/** @deprecated Import dari file domain spesifik, mis. `@repo/types/todo.types`. */
export type {
  ITodo,
  PickCreateTodo,
  PickUpdateTodo,
  Todo,
  TodoParams,
  TodoQuery,
  TodoStatus,
} from "./todo.types";
export type {
  INote,
  Note,
  NoteParams,
  PickCreateNote,
  PickUpdateNote,
} from "./note.types";
export type {
  CalendarEvent,
  EventParams,
  EventQuery,
  ICalendarEvent,
  PickCreateEvent,
  PickUpdateEvent,
} from "./calendar.types";
export type {
  IMusicPlaylist,
  IMusicPlayListItem,
  MusicPlaylist,
  PickCreatePlaylist,
  PickAddMusicItem,
  PlaylistParams,
} from "./music.types";
export type {
  INotificationLog,
  NotificationLog,
  NotificationLogQuery,
  NotificationStatus,
  PickSendNotification,
} from "./notification.types";
export type {
  ISettings,
  PickUpdateSettings,
  Settings,
  ThemePreference,
  TimeFormat,
} from "./settings.types";
