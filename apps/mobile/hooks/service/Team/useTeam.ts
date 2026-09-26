import {
  useAddTeamMember,
  useCreateTeam,
  useDeleteTeam,
  useRemoveTeamMember,
  useUpdateTeam,
} from "./state/mutate";
import { useListTeamMembers, useListTeams } from "./state/query";

export const useTeam = () => {
  return {
    mutate: {
      create: useCreateTeam,
      update: useUpdateTeam,
      delete: useDeleteTeam,
      addMember: useAddTeamMember,
      removeMember: useRemoveTeamMember,
    },
    query: {
      list: useListTeams,
      listMembers: useListTeamMembers,
    },
  };
};
