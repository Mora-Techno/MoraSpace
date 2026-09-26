import type { Session } from "@repo/types";

import { queryKey } from "@/configs";
import { useAppMutation } from "@/hooks/useAppMutation";
import Api from "@/services/api";

import { readSessionSnapshot, type SessionCacheContext } from "./utils";

export function useDeleteSessionById() {
  return useAppMutation<Session, string, SessionCacheContext>({
    mutationFn: (id: string) => Api.Session.DeleteSessionById(id),
    invalidateKeys: [queryKey.sessionRoot()],
    optimistic: (ns) => ({ previousData: readSessionSnapshot(ns) }),
  });
}

export function useDeleteSessionAll() {
  return useAppMutation<Session[], void, SessionCacheContext>({
    mutationFn: () => Api.Session.DeleteSessionAll(),
    invalidateKeys: [queryKey.sessionRoot()],
    optimistic: (ns) => ({ previousData: readSessionSnapshot(ns) }),
  });
}
