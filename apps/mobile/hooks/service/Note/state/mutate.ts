import type { Note, PickCreateNote, PickUpdateNote } from '@repo/types';
import type { TResponse } from '@repo/types/response.types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Alert } from 'react-native';
import { queryKey } from '@/config/query-key';

import Api from '@/service/props.service';
import { type NoteCacheContext, readNoteDetailSnapshot, readNoteListSnapshot } from './utils';

export function useCreateNote() {
  const queryClient = useQueryClient();

  return useMutation<TResponse<Note>, Error, PickCreateNote, NoteCacheContext>({
    mutationFn: (payload) => Api.Note.CreateNote(payload),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: queryKey.notesRoot() });
      return { previousList: readNoteListSnapshot(queryClient) };
    },
    onSuccess: (res) => {
      Alert.alert('Sukses', res.message);
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKey.notesRoot() });
    },
    onError: (err, _variables, context) => {
      if (context?.previousList !== undefined) {
        queryClient.setQueryData(queryKey.notes.list(), context.previousList);
      }
      Alert.alert('Error', err.message);
    },
  });
}

export function useDeleteNote() {
  const queryClient = useQueryClient();

  return useMutation<TResponse<Note>, Error, string, NoteCacheContext>({
    mutationFn: (id) => Api.Note.DeleteNote(id),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: queryKey.notesRoot() });
      return { previousList: readNoteListSnapshot(queryClient) };
    },
    onSuccess: (res) => {
      Alert.alert('Sukses', res.message);
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKey.notesRoot() });
    },
    onError: (err, _variables, context) => {
      if (context?.previousList !== undefined) {
        queryClient.setQueryData(queryKey.notes.list(), context.previousList);
      }
      Alert.alert('Error', err.message);
    },
  });
}

export function useUpdateNote() {
  const queryClient = useQueryClient();

  return useMutation<
    TResponse<Note>,
    Error,
    { id: string; payload: PickUpdateNote },
    NoteCacheContext
  >({
    mutationFn: ({ id, payload }) => Api.Note.UpdateNote(id, payload),
    onMutate: async ({ id }) => {
      await queryClient.cancelQueries({ queryKey: queryKey.notesRoot() });
      return {
        previousList: readNoteListSnapshot(queryClient),
        previousDetail: readNoteDetailSnapshot(queryClient, id),
      };
    },
    onSuccess: (res) => {
      Alert.alert('Sukses', res.message);
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKey.notesRoot() });
    },
    onError: (err, variables, context) => {
      if (context?.previousList !== undefined) {
        queryClient.setQueryData(queryKey.notes.list(), context.previousList);
      }
      if (context?.previousDetail !== undefined) {
        queryClient.setQueryData(queryKey.notes.detail(variables.id), context.previousDetail);
      }
      Alert.alert('Error', err.message);
    },
  });
}
