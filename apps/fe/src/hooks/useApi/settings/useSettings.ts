import { useUpdateSettings } from './state/mutate';
import { useGetSettings } from './state/query';

export const useSettings = () => {
  return {
    mutate: {
      update: useUpdateSettings,
    },
    query: {
      detail: useGetSettings,
    },
  };
};
