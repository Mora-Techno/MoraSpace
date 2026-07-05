"use client";

import { EventQuery } from "@repo/types";
import { useQuery } from "@tanstack/react-query";

import Api from "@/services/api";

import { eventsListKey, MODULE_QUERY_STALE_TIME } from "./utils";

export function useEvents(query?: EventQuery) {
  return useQuery({
    queryKey: eventsListKey(query),
    queryFn: async () => {
      const res = await Api.Calendar.ListEvents(query);
      return res.data;
    },
    staleTime: MODULE_QUERY_STALE_TIME,
  });
}
