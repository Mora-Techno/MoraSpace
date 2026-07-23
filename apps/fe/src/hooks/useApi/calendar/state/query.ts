'use client';

import { MODULE_QUERY } from '@repo/config/query-stale';
import type { EventQuery } from '@repo/types';
import { useQuery } from '@tanstack/react-query';

import Api from '@/services/api';

import { eventsListKey } from './utils';

export function useEvents(query?: EventQuery) {
  return useQuery({
    queryKey: eventsListKey(query),
    queryFn: async () => {
      const res = await Api.Calendar.ListEvents(query);
      return res.data;
    },
    staleTime: MODULE_QUERY,
  });
}
