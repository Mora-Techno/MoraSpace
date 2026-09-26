import type {
  AdminUser,
  CalendarEvent,
  CompanyProfile,
  IDepartment,
  ICompanyMember,
  IInvitation,
  IMusicPlayListItem,
  IPosition,
  IPomodoroSession,
  IRole,
  ITask,
  ITeam,
  MusicPlaylist,
  Note,
  NotificationInApp,
  NotificationLog,
  SafeAuthUser,
  Session,
  Settings,
  Todo,
  TodoQuery,
  TrackCatalog,
} from "../../types";

import { queryKey } from "../query-key";
import {
  type AppNameSpaceLike,
  extractQueryClient,
  type QueryClientLike,
} from "./client";

export type CacheTarget = AppNameSpaceLike | QueryClientLike;

// Auth
export type AuthCacheContext = {
  previousData?: SafeAuthUser;
};

export function readAuthSnapshot(target: CacheTarget): SafeAuthUser | undefined {
  return extractQueryClient(target).getQueryData<SafeAuthUser>(queryKey.auth.me());
}

// Company
export type CompanyCacheContext = {
  previousData?: CompanyProfile;
};

export const companyRootKey = queryKey.companiesRoot();
export const companyRooyKey = companyRootKey;

export function readCompanySnapshot(
  target: CacheTarget,
): CompanyProfile | undefined {
  return extractQueryClient(target).getQueryData<CompanyProfile>(
    queryKey.companies.me(),
  );
}

// Todo
export type TodoCacheContext = {
  previousData?: Todo[];
};

export const todosListKey = (filters?: TodoQuery) =>
  queryKey.todos.list(filters);
export const todoRootKey = queryKey.todosRoot();

export function readTodoSnapshot(
  target: CacheTarget,
  filters?: TodoQuery,
): Todo[] | undefined {
  return extractQueryClient(target).getQueryData<Todo[]>(todosListKey(filters));
}

// Note
export type NoteCacheContext = {
  previousList?: Note[];
  previousDetail?: Note;
};

export function readNoteListSnapshot(target: CacheTarget): Note[] | undefined {
  return extractQueryClient(target).getQueryData<Note[]>(queryKey.notes.list());
}

export function readNoteDetailSnapshot(
  target: CacheTarget,
  id: string,
): Note | undefined {
  return extractQueryClient(target).getQueryData<Note>(
    queryKey.notes.detail(id),
  );
}

// Calendar
export type CalendarCacheContext = {
  previousData?: CalendarEvent[];
};

export const calenderRootKey = queryKey.calendersRoot();
export const eventsListKey = (query?: import("../../types/calendar.types").EventQuery) =>
  queryKey.calendar.list(query);

export function readEventSnapshot(
  target: CacheTarget,
): CalendarEvent[] | undefined {
  return extractQueryClient(target).getQueryData<CalendarEvent[]>(
    calenderRootKey,
  );
}

// Department
export type DepartmentCacheContext = {
  previousData?: IDepartment[];
};

export const departmentRootKey = queryKey.departmentsRoot();

export function readDepartmentSnapshot(
  target: CacheTarget,
): IDepartment[] | undefined {
  return extractQueryClient(target).getQueryData<IDepartment[]>(
    departmentRootKey,
  );
}

// Invitation
export type InvitationCacheContext = {
  previousData?: IInvitation[];
};

export const invitationsRootKey = queryKey.invitationsRoot();

export function readInvitationSnapshot(
  target: CacheTarget,
): IInvitation[] | undefined {
  return extractQueryClient(target).getQueryData<IInvitation[]>(
    invitationsRootKey,
  );
}

// Member
export type MemberCacheContext = {
  previousData?: ICompanyMember[];
};

export const membersRoot = queryKey.membersRoot();

export function readMemberSnapshot(
  target: CacheTarget,
): ICompanyMember[] | undefined {
  return extractQueryClient(target).getQueryData<ICompanyMember[]>(membersRoot);
}

// Music
export type MusicCacheContext = {
  previousData?: MusicPlaylist[];
};

export function readPlaylistSnapshot(
  target: CacheTarget,
): MusicPlaylist[] | undefined {
  return extractQueryClient(target).getQueryData<MusicPlaylist[]>(
    queryKey.music.list(),
  );
}

// Notification
export type NotificationCacheContext = {
  previousData?: NotificationLog[];
};

export type NotificationListCacheContext = {
  previousData?: NotificationInApp[];
};

export const notificationsRootKey = queryKey.notificationsRoot();
export const notificationLogsKey = (query?: import("../../types/notification.types").NotificationLogQuery) =>
  queryKey.notifications.logs(query);

export function readNotificationLogsSnapshot(
  target: CacheTarget,
): NotificationLog[] | undefined {
  return extractQueryClient(target).getQueryData<NotificationLog[]>(
    notificationsRootKey,
  );
}

export function readNotificationsSnapshot(
  target: CacheTarget,
): NotificationInApp[] | undefined {
  return extractQueryClient(target).getQueryData<NotificationInApp[]>(
    notificationsRootKey,
  );
}

// Pomodoro
export type PomodoroCacheContext = {
  previousData?: IPomodoroSession;
};

export const podomoroRoot = queryKey.pomodoro.active();

export function readPomodoroSnapshot(
  target: CacheTarget,
): IPomodoroSession | undefined {
  return extractQueryClient(target).getQueryData<IPomodoroSession>(
    podomoroRoot,
  );
}

// Position
export type PositionCacheContext = {
  previousData?: IPosition[];
};

export const positionsRoot = queryKey.positionsRoot();

export function readPositionSnapshot(
  target: CacheTarget,
): IPosition[] | undefined {
  return extractQueryClient(target).getQueryData<IPosition[]>(positionsRoot);
}

// Role
export type RoleCacheContext = {
  previousData?: IRole[];
};

export const rolesRoot = queryKey.rolesRoot();

export function readRoleSnapshot(target: CacheTarget): IRole[] | undefined {
  return extractQueryClient(target).getQueryData<IRole[]>(rolesRoot);
}

// Session
export type SessionCacheContext = {
  previousData?: Session[];
};

export function readSessionSnapshot(
  target: CacheTarget,
): Session[] | undefined {
  return extractQueryClient(target).getQueryData<Session[]>(
    queryKey.session.list(),
  );
}

// Settings
export type SettingsCacheContext = {
  previousData?: Settings;
};

export const SettingsRoot = queryKey.settings.detail();

export function readSettingsSnapshot(
  target: CacheTarget,
): Settings | undefined {
  return extractQueryClient(target).getQueryData<Settings>(SettingsRoot);
}

// Subscription
export type SubscriptionCacheContext = {
  previousData?: unknown;
};

export const subscriptionsRootKey = queryKey.subscriptionsRoot();

// Task
export type TaskCacheContext = {
  previousData?: ITask[];
};

export function readTaskSnapshot(target: CacheTarget): ITask[] | undefined {
  return extractQueryClient(target).getQueryData<ITask[]>(queryKey.tasks.list());
}

// Team
export type TeamCacheContext = {
  previousData?: ITeam[];
};

export const teamsRoot = queryKey.teamsRoot();

export function readTeamSnapshot(target: CacheTarget): ITeam[] | undefined {
  return extractQueryClient(target).getQueryData<ITeam[]>(teamsRoot);
}

// Track Catalog
export type TrackCatalogCacheContext = {
  previousData?: TrackCatalog[];
};

export const trackCatalogRootKey = queryKey.trackCatalogRoot();

export function readTrackCatalogSnapshot(
  target: CacheTarget,
): TrackCatalog[] | undefined {
  return extractQueryClient(target).getQueryData<TrackCatalog[]>(
    trackCatalogRootKey,
  );
}
