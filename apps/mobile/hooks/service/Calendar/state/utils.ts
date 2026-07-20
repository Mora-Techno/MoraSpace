import type { CalendarEvent, EventQuery } from '@repo/types/calendar.types';
import type { QueryClient } from '@tanstack/react-query';

import { queryKey } from '@/config/query-key';

export type CalendarCacheContext = {
  previousData?: CalendarEvent[];
};

export const eventsListKey = (query?: EventQuery) => queryKey.calendar.list(query);
export const calenderRootKey = queryKey.calendarRoot();

export function readEventSnapshot(
  queryClient: QueryClient,
  query?: EventQuery,
): CalendarEvent[] | undefined {
  return queryClient.getQueryData<CalendarEvent[]>(eventsListKey(query));
}
