import { useCreatePosition, useDeletePosition, useUpdatePosition } from './state/mutate';
import { useListPositions } from './state/query';

export const usePosition = () => {
  return {
    mutate: {
      create: useCreatePosition,
      update: useUpdatePosition,
      delete: useDeletePosition,
    },
    query: {
      list: useListPositions,
    },
  };
};
