import {
  useDeleteMember,
  useUpdateContacts,
  useUpdateMember,
  useUpdateProfile,
} from './state/mutate';
import { useGetContacts, useGetMember, useGetProfile, useListMembers } from './state/query';

export const useMember = () => {
  return {
    mutate: {
      update: useUpdateMember,
      delete: useDeleteMember,
      updateProfile: useUpdateProfile,
      updateContacts: useUpdateContacts,
    },
    query: {
      list: useListMembers,
      detail: useGetMember,
      profile: useGetProfile,
      contacts: useGetContacts,
    },
  };
};
