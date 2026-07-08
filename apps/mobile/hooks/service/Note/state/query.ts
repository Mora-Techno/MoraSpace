import { useQuery } from '@tanstack/react-query';
import { queryKey } from '@/config/query-key';

import Api from '@/service/props.service';

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
