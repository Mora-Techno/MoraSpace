import type { Note, PickCreateNote, PickUpdateNote } from '@repo/types';
import type { PickApiID } from '@repo/types/api.types';
import { useMutation } from '@tanstack/react-query';

import { queryKey } from '@/configs';
import { useAppNameSpace } from '@/hooks/useAppNameSpace';
import Api from '@/services/api';
import type { TResponse } from '@/types/api/response';

import { type NoteCacheContext, readNoteDetailSnapshot, readNoteListSnapshot } from './utils';

export function useCreateNote() {
  const ns = useAppNameSpace();

  return useMutation<TResponse<Note>, Error, PickCreateNote, NoteCacheContext>({
    mutationFn: (payload) => Api.Note.CreateNote(payload),
    onMutate: async () => {
      await ns.queryClient.cancelQueries({ queryKey: queryKey.notesRoot() });
      return { previousList: readNoteListSnapshot(ns) };
    },
    onSuccess: (res) => {
      ns.alert.toast({
        title: res.message,
        message: res.message,
        icon: 'success',
      });
    },
    onSettled: async () => {
      await ns.queryClient.invalidateQueries({
        queryKey: queryKey.notesRoot(),
      });
    },
    onError: (err, _variables, context) => {
      if (context?.previousList !== undefined) {
        ns.queryClient.setQueryData(queryKey.notes.list(), context.previousList);
      }
      ns.alert.toast({
        title: err.message,
        message: err.message,
        icon: 'error',
      });
    },
  });
}

export function useDeleteNote() {
  const ns = useAppNameSpace();

  return useMutation<TResponse<Note>, Error, string, NoteCacheContext>({
    mutationFn: (id) => Api.Note.DeleteNote(id),
    onMutate: async () => {
      await ns.queryClient.cancelQueries({ queryKey: queryKey.notesRoot() });
      return { previousList: readNoteListSnapshot(ns) };
    },
    onSuccess: (res) => {
      ns.alert.toast({
        title: res.message,
        message: res.message,
        icon: 'success',
      });
    },
    onSettled: async () => {
      await ns.queryClient.invalidateQueries({
        queryKey: queryKey.notesRoot(),
      });
    },
    onError: (err, _variables, context) => {
      if (context?.previousList !== undefined) {
        ns.queryClient.setQueryData(queryKey.notes.list(), context.previousList);
      }
      ns.alert.toast({
        title: err.message,
        message: err.message,
        icon: 'error',
      });
    },
  });
}

export function useUpdateNote() {
  const ns = useAppNameSpace();

  return useMutation<
    TResponse<Note>,
    Error,
    { id: PickApiID; payload: PickUpdateNote },
    NoteCacheContext
  >({
    mutationFn: ({ id, payload }) => Api.Note.UpdateNote(id.id, payload),
    onMutate: async ({ id }) => {
      await ns.queryClient.cancelQueries({ queryKey: queryKey.notesRoot() });
      return {
        previousList: readNoteListSnapshot(ns),
        previousDetail: readNoteDetailSnapshot(ns, id.id),
      };
    },
    onSuccess: (res) => {
      ns.alert.toast({
        title: res.message,
        message: res.message,
        icon: 'success',
      });
    },
    onSettled: async () => {
      await ns.queryClient.invalidateQueries({
        queryKey: queryKey.notesRoot(),
      });
    },
    onError: (err, variables, context) => {
      if (context?.previousList !== undefined) {
        ns.queryClient.setQueryData(queryKey.notes.list(), context.previousList);
      }
      if (context?.previousDetail !== undefined) {
        ns.queryClient.setQueryData(queryKey.notes.detail(variables.id.id), context.previousDetail);
      }
      ns.alert.toast({
        title: err.message,
        message: err.message,
        icon: 'error',
      });
    },
  });
}
