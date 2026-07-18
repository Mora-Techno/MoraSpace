import {
  useAcceptInvitation,
  useCreateInvitation,
  useDeleteInvitation,
  useRejectInvitation,
} from "./state/mutate";
import { useListInvitations } from "./state/query";

export const useInvitation = () => {
  return {
    mutate: {
      create: useCreateInvitation,
      accept: useAcceptInvitation,
      reject: useRejectInvitation,
      delete: useDeleteInvitation,
    },
    query: {
      list: useListInvitations,
    },
  };
};
