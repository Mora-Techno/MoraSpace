import type { PickApiID } from "@repo/types/api.types";
import type {
  CalendarEvent,
  PickCreateEvent,
  PickUpdateEvent,
} from "@repo/types/calendar.types";
import { useAppMutation } from "@/hooks/useAppMutation";
import Api from "@/service/props.service";
import {
  type CalendarCacheContext,
  calenderRootKey,
  readEventSnapshot,
} from "./utils";

export function useCreateEvent() {
  return useAppMutation<CalendarEvent, PickCreateEvent, CalendarCacheContext>({
    mutationFn: (payload) => Api.Calendar.CreateEvent(payload),
    invalidateKeys: [calenderRootKey],
    optimistic: (ns) => ({ previousData: readEventSnapshot(ns) }),
    onError: (err, _vars, context, ns) => {
      if (context?.previousData !== undefined) {
        ns.queryClient.setQueryData(calenderRootKey, context.previousData);
      }
      ns.alert.toast({
        title: "Error",
        message: err.message,
        icon: "error",
      });
    },
  });
}

export function useDeleteEvent() {
  return useAppMutation<CalendarEvent, PickApiID, CalendarCacheContext>({
    mutationFn: (id) => Api.Calendar.DeleteEvent(id),
    invalidateKeys: [calenderRootKey],
    optimistic: (ns) => ({ previousData: readEventSnapshot(ns) }),
    onError: (err, _vars, context, ns) => {
      if (context?.previousData !== undefined) {
        ns.queryClient.setQueryData(calenderRootKey, context.previousData);
      }
      ns.alert.toast({
        title: "Error",
        message: err.message,
        icon: "error",
      });
    },
  });
}

export function useUpdateEvent() {
  return useAppMutation<
    CalendarEvent,
    { id: PickApiID; payload: PickUpdateEvent },
    CalendarCacheContext
  >({
    mutationFn: ({ id, payload }) => Api.Calendar.UpdateEvent(id, payload),
    invalidateKeys: [calenderRootKey],
    optimistic: (ns) => ({ previousData: readEventSnapshot(ns) }),
    onError: (err, _vars, context, ns) => {
      if (context?.previousData !== undefined) {
        ns.queryClient.setQueryData(calenderRootKey, context.previousData);
      }
      ns.alert.toast({
        title: "Error",
        message: err.message,
        icon: "error",
      });
    },
  });
}
