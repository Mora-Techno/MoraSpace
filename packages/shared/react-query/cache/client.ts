import type { QueryClient } from "@tanstack/react-query";

export type QueryClientLike = {
  getQueryData: QueryClient["getQueryData"];
};

export type AppNameSpaceLike = {
  queryClient: QueryClientLike;
};

export function extractQueryClient(
  target: AppNameSpaceLike | QueryClientLike | QueryClient,
): QueryClientLike {
  if ("queryClient" in target && target.queryClient) {
    return target.queryClient as QueryClientLike;
  }
  return target as QueryClientLike;
}
