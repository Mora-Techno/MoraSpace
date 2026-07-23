import { useCreateNote, useDeleteNote, useUpdateNote } from "./state/mutate";
import { useNote, useNotes } from "./state/query";

export const useNotess = () => {
  return {
    mutate: {
      create: useCreateNote,
      delete: useDeleteNote,
      update: useUpdateNote,
    },
    query: {
      get: useNotes,
      getByID: useNote,
    },
  };
};
