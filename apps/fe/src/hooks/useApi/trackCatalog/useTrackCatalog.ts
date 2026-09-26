import {
  useApproveTrack,
  useDeleteTrack,
  useRejectTrack,
  useSubmitTrack,
} from "./state/mutate";
import { usePendingTracks, useTrackCatalogList } from "./state/query";

export const useTrackCatalog = () => {
  return {
    mutate: {
      submit: useSubmitTrack,
      approve: useApproveTrack,
      reject: useRejectTrack,
      delete: useDeleteTrack,
    },
    query: {
      list: useTrackCatalogList,
      pending: usePendingTracks,
    },
  };
};
