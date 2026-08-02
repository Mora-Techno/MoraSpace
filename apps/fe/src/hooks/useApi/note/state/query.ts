import { MODULE_QUERY } from "@repo/config/query-stale";
import { useQuery } from "@tanstack/react-query";

import { queryKey } from "@/configs";
import Api from "@/services/api";

export function useNote(id: string) {
  return useQuery({
    queryKey: queryKey.notes.detail(id),
    queryFn: async () => {
      const res = await Api.Note.GetNote(id);
      return res.data;
    },
    staleTime: MODULE_QUERY,
    enabled: !!id,
  });
}

export function useNotes(query?: import("@repo/types").NoteQuery) {
  return useQuery({
    queryKey: queryKey.notes.list(query),
    queryFn: async () => {
      const res = await Api.Note.ListNotes(query);
      return res.data;
    },
    staleTime: MODULE_QUERY,
  });
}
