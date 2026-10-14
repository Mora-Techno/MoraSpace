import {
  useAddGroupMember,
  useCreateGroup,
  useLeaveConversation,
  useOpenDirect,
  useRemoveGroupMember,
  useSetGroupMemberRole,
  useTransferOwnership,
  useUpdateGroup,
} from './state/mutate';
import { useChatMembers, useChatMessages, useChatUserSearch, useConversations } from './state/query';

export const useChat = () => {
  return {
    mutate: {
      openDirect: useOpenDirect,
      createGroup: useCreateGroup,
      updateGroup: useUpdateGroup,
      addMember: useAddGroupMember,
      setMemberRole: useSetGroupMemberRole,
      removeMember: useRemoveGroupMember,
      leave: useLeaveConversation,
      transferOwnership: useTransferOwnership,
    },
    query: {
      conversations: useConversations,
      messages: useChatMessages,
      members: useChatMembers,
      userSearch: useChatUserSearch,
    },
  };
};
