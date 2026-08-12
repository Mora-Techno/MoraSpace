import { useTestingEmail, useUpdateSettings } from "./state/mutate";
import { useGetSettings } from "./state/query";

export const useSettings = () => {
  return {
    mutate: {
      update: useUpdateSettings,
      Testing: useTestingEmail,
    },
    query: {
      detail: useGetSettings,
    },
  };
};
