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
    enabled: !!id,
  });
}

export function useNotes() {
  return useQuery({
    queryKey: queryKey.notes.list(),
    queryFn: async () => {
      const res = await Api.Note.ListNotes();
      return res.data;
    },
  });
}
