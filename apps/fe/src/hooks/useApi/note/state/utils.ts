import type { Note } from '@repo/types';

import { queryKey } from '@/configs';
import type { AppNameSpace } from '@/hooks/useAppNameSpace';

export type NoteCacheContext = {
  previousList?: Note[];
  previousDetail?: Note;
};

export function readNoteListSnapshot(ns: AppNameSpace): Note[] | undefined {
  return ns.queryClient.getQueryData<Note[]>(queryKey.notes.list());
}

export function readNoteDetailSnapshot(ns: AppNameSpace, id: string): Note | undefined {
  return ns.queryClient.getQueryData<Note>(queryKey.notes.detail(id));
}
