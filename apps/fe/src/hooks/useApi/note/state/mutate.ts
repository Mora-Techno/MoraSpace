import type { Note, PickCreateNote, PickUpdateNote } from "@repo/types";
import type { PickApiID } from "@repo/types/api.types";

import { queryKey } from "@/configs";
import { useAppMutation } from "@/hooks/useAppMutation";
import Api from "@/services/api";

import {
  type NoteCacheContext,
  readNoteDetailSnapshot,
  readNoteListSnapshot,
} from "./utils";

export function useCreateNote() {
  return useAppMutation<Note, PickCreateNote, NoteCacheContext>({
    mutationFn: (payload) => Api.Note.CreateNote(payload),
    invalidateKeys: [queryKey.notesRoot()],
    optimistic: (ns) => ({ previousList: readNoteListSnapshot(ns) }),
    onError: (err, _vars, context, ns) => {
      if (context?.previousList !== undefined) {
        ns.queryClient.setQueryData(queryKey.notes.list(), context.previousList);
      }
      ns.alert.toast({
        title: err.message,
        message: err.message,
        icon: "error",
      });
    },
  });
}

export function useDeleteNote() {
  return useAppMutation<Note, string, NoteCacheContext>({
    mutationFn: (id) => Api.Note.DeleteNote(id),
    invalidateKeys: [queryKey.notesRoot()],
    optimistic: (ns) => ({ previousList: readNoteListSnapshot(ns) }),
    onError: (err, _vars, context, ns) => {
      if (context?.previousList !== undefined) {
        ns.queryClient.setQueryData(queryKey.notes.list(), context.previousList);
      }
      ns.alert.toast({
        title: err.message,
        message: err.message,
        icon: "error",
      });
    },
  });
}

export function useUpdateNote() {
  return useAppMutation<
    Note,
    { id: PickApiID; payload: PickUpdateNote },
    NoteCacheContext
  >({
    mutationFn: ({ id, payload }) => Api.Note.UpdateNote(id.id, payload),
    invalidateKeys: [queryKey.notesRoot()],
    optimistic: (ns, { id }) => ({
      previousList: readNoteListSnapshot(ns),
      previousDetail: readNoteDetailSnapshot(ns, id.id),
    }),
    onError: (err, { id }, context, ns) => {
      if (context?.previousList !== undefined) {
        ns.queryClient.setQueryData(queryKey.notes.list(), context.previousList);
      }
      if (context?.previousDetail !== undefined) {
        ns.queryClient.setQueryData(
          queryKey.notes.detail(id.id),
          context.previousDetail,
        );
      }
      ns.alert.toast({
        title: err.message,
        message: err.message,
        icon: "error",
      });
    },
  });
}
