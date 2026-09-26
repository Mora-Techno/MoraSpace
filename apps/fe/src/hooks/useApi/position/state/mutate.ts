import type {
  IPosition,
  PickCreatePosition,
  PickUpdatePosition,
} from "@repo/types";

import { useAppMutation } from "@/hooks/useAppMutation";
import Api from "@/services/api";

import {
  type PositionCacheContext,
  positionsRoot,
  readPositionSnapshot,
} from "./utils";

export function useCreatePosition() {
  return useAppMutation<IPosition, PickCreatePosition, PositionCacheContext>({
    mutationFn: (payload) => Api.Position.CreatePosition(payload),
    invalidateKeys: [positionsRoot],
    optimistic: (ns) => ({ previousData: readPositionSnapshot(ns) }),
  });
}

export function useUpdatePosition() {
  return useAppMutation<
    IPosition,
    { id: string; payload: PickUpdatePosition },
    PositionCacheContext
  >({
    mutationFn: ({ id, payload }) => Api.Position.UpdatePosition(id, payload),
    invalidateKeys: [positionsRoot],
    optimistic: (ns) => ({ previousData: readPositionSnapshot(ns) }),
  });
}

export function useDeletePosition() {
  return useAppMutation<IPosition, { id: string }, PositionCacheContext>({
    mutationFn: ({ id }) => Api.Position.DeletePosition(id),
    invalidateKeys: [positionsRoot],
    optimistic: (ns) => ({ previousData: readPositionSnapshot(ns) }),
  });
}
