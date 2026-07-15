import type { Note } from '@repo/types';
import type { QueryClient } from '@tanstack/react-query';

import { queryKey } from '@/config/query-key';

export type NoteCacheContext = {
  previousList?: Note[];
  previousDetail?: Note;
};

export function readNoteListSnapshot(queryClient: QueryClient): Note[] | undefined {
  return queryClient.getQueryData<Note[]>(queryKey.notes.list());
}

export function readNoteDetailSnapshot(queryClient: QueryClient, id: string): Note | undefined {
  return queryClient.getQueryData<Note>(queryKey.notes.detail(id));
}
