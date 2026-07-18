import {
  useAddTeamMember,
  useCreateTeam,
  useDeleteTeam,
  useInviteTeamMember,
  useRemoveTeamMember,
  useUpdateTeam,
} from './state/mutate';
import { useListTeamMembers, useListTeams } from './state/query';

export const useTeam = () => {
  return {
    mutate: {
      create: useCreateTeam,
      update: useUpdateTeam,
      delete: useDeleteTeam,
      addMember: useAddTeamMember,
      removeMember: useRemoveTeamMember,
      inviteMember: useInviteTeamMember,
    },
    query: {
      list: useListTeams,
      listMembers: useListTeamMembers,
    },
  };
};
