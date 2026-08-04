"use client";

import { MODULE_QUERY } from "@repo/config/query-stale";
import type { EventQuery } from "@repo/types";
import { useQuery } from "@tanstack/react-query";

import { queryKey } from "@/configs";
import Api from "@/services/api";

import { eventsListKey } from "./utils";

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

export function useEvent(id: string) {
  return useQuery({
    queryKey: queryKey.calendar.detail(id),
    queryFn: async () => {
      const res = await Api.Calendar.GetEvent(id);
      return res.data;
    },
    staleTime: MODULE_QUERY,
    enabled: !!id,
  });
}
