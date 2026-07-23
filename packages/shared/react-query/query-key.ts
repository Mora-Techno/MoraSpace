import type { EventQuery } from '../types/calendar.types';
import type { NotificationLogQuery } from '../types/notification.types';
import type { TodoQuery } from '../types/todo.types';

export const queryKey = {
  todosRoot: () => ['todos'] as const,
  todos: {
    list: (filters?: TodoQuery) => ['todos', 'list', filters ?? {}] as const,
  },

  notesRoot: () => ['notes'] as const,
  notes: {
    list: () => ['notes', 'list'] as const,
    detail: (id: string) => ['notes', 'detail', id] as const,
  },

  calendarRoot: () => ['calendar', 'events'] as const,
  calendar: {
    list: (query?: EventQuery) => ['calendar', 'events', 'list', query ?? {}] as const,
  },

  musicRoot: () => ['music', 'playlists'] as const,
  music: {
    list: () => ['music', 'playlists', 'list'] as const,
  },

  notificationsRoot: () => ['notifications'] as const,
  notifications: {
    logs: (query?: NotificationLogQuery) => ['notifications', 'logs', query ?? {}] as const,
    list: () => ['notifications', 'list'] as const,
    queue: () => ['notifications', 'queue'] as const,
  },

  settingsRoot: () => ['settings'] as const,
  settings: {
    detail: () => ['settings', 'detail'] as const,
  },

  subscriptionsRoot: () => ['subscriptions'] as const,
  subscriptions: {
    plans: () => ['subscriptions', 'plans'] as const,
    me: () => ['subscriptions', 'me'] as const,
  },

  companiesRoot: () => ['companies'] as const,
  companies: {
    admins: () => ['companies', 'admins'] as const,
    me: () => ['companies', 'me'] as const,
  },

  departmentsRoot: () => ['departments'] as const,
  departments: {
    list: () => ['departments', 'list'] as const,
    detail: (id: string) => ['departments', 'detail', id] as const,
  },

  teamsRoot: () => ['teams'] as const,
  teams: {
    list: (query?: { departmentId?: string }) => ['teams', 'list', query ?? {}] as const,
    members: (id: string) => ['teams', 'members', id] as const,
  },

  positionsRoot: () => ['positions'] as const,
  positions: {
    list: () => ['positions', 'list'] as const,
  },

  membersRoot: () => ['members'] as const,
  members: {
    list: () => ['members', 'list'] as const,
    detail: (id: string) => ['members', 'detail', id] as const,
    profile: (id: string) => ['members', 'profile', id] as const,
    contacts: (id: string) => ['members', 'contacts', id] as const,
  },

  invitationsRoot: () => ['invitations'] as const,
  invitations: {
    list: () => ['invitations', 'list'] as const,
  },

  rolesRoot: () => ['roles'] as const,
  roles: {
    list: () => ['roles', 'list'] as const,
    permissions: (id: string) => ['roles', 'permissions', id] as const,
    masterPermissions: () => ['roles', 'masterPermissions'] as const,
  },

  tasksRoot: () => ['tasks'] as const,
  tasks: {
    list: () => ['tasks', 'list'] as const,
    detail: (id: string) => ['tasks', 'detail', id] as const,
    activities: (id: string) => ['tasks', 'activities', id] as const,
  },

  pomodoroRoot: () => ['pomodoro'] as const,
  pomodoro: {
    today: () => ['pomodoro', 'today'] as const,
    statistics: () => ['pomodoro', 'statistics'] as const,
  },

  sessionRoot: () => ['session'] as const,
  session: {
    list: () => ['session', 'list'] as const,
    detail: (id: string) => ['session', 'detail', id] as const,
  },
} as const;
