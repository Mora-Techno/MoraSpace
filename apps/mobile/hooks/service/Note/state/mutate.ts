import type { Note, PickCreateNote, PickUpdateNote } from "@repo/types";
import { queryKey } from "@/config/query-key";
import { useAppMutation } from "@/hooks/useAppMutation";
import Api from "@/service/props.service";
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
        title: "Error",
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
        title: "Error",
        message: err.message,
        icon: "error",
      });
    },
  });
}

export function useUpdateNote() {
  return useAppMutation<
    Note,
    { id: string; payload: PickUpdateNote },
    NoteCacheContext
  >({
    mutationFn: ({ id, payload }) => Api.Note.UpdateNote(id, payload),
    invalidateKeys: [queryKey.notesRoot()],
    optimistic: (ns, { id }) => ({
      previousList: readNoteListSnapshot(ns),
      previousDetail: readNoteDetailSnapshot(ns, id),
    }),
    onError: (err, { id }, context, ns) => {
      if (context?.previousList !== undefined) {
        ns.queryClient.setQueryData(queryKey.notes.list(), context.previousList);
      }
      if (context?.previousDetail !== undefined) {
        ns.queryClient.setQueryData(
          queryKey.notes.detail(id),
          context.previousDetail,
        );
      }
      ns.alert.toast({
        title: "Error",
        message: err.message,
        icon: "error",
      });
    },
  });
}
