import { useSubmitTrack, useDeleteTrack } from "./state/mutate";
import { useTrackCatalogList } from "./state/query";

export const useTrackCatalog = () => {
  return {
    mutate: {
      submit: useSubmitTrack,
      delete: useDeleteTrack,
    },
    query: {
      list: useTrackCatalogList,
    },
  };
};
