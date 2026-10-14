import type {
  ChatMemberInfo,
  IConversation,
  IConversationMember,
  PickCreateGroup,
  PickManageGroupMember,
  PickOpenDirect,
  PickTransferOwnership,
  PickUpdateGroup,
} from '@repo/types';

import { useAppMutation } from '@/hooks/useAppMutation';
import Api from '@/services/api';

import type { ChatCacheContext } from './utils';
import { chatRootKey } from './utils';

export function useOpenDirect() {
  return useAppMutation<IConversation, PickOpenDirect, ChatCacheContext>({
    mutationFn: (payload) => Api.Chat.OpenDirect(payload),
    invalidateKeys: [chatRootKey],
    showSuccessToast: false,
  });
}

export function useCreateGroup() {
  return useAppMutation<IConversation, PickCreateGroup, ChatCacheContext>({
    mutationFn: (payload) => Api.Chat.CreateGroup(payload),
    invalidateKeys: [chatRootKey],
  });
}

export function useUpdateGroup() {
  return useAppMutation<IConversation, { id: string; payload: PickUpdateGroup }, ChatCacheContext>({
    mutationFn: ({ id, payload }) => Api.Chat.UpdateGroup(id, payload),
    invalidateKeys: [chatRootKey],
  });
}

export function useAddGroupMember() {
  return useAppMutation<
    IConversationMember,
    { id: string; payload: PickManageGroupMember },
    ChatCacheContext
  >({
    mutationFn: ({ id, payload }) => Api.Chat.AddMember(id, payload),
    invalidateKeys: [chatRootKey],
  });
}

export function useSetGroupMemberRole() {
  return useAppMutation<
    IConversationMember,
    { id: string; payload: PickManageGroupMember },
    ChatCacheContext
  >({
    mutationFn: ({ id, payload }) => Api.Chat.SetMemberRole(id, payload),
    invalidateKeys: [chatRootKey],
  });
}

export function useRemoveGroupMember() {
  return useAppMutation<IConversationMember, { id: string; userId: string }, ChatCacheContext>({
    mutationFn: ({ id, userId }) => Api.Chat.RemoveMember(id, userId),
    invalidateKeys: [chatRootKey],
  });
}

export function useLeaveConversation() {
  return useAppMutation<{ archived: boolean }, { id: string }, ChatCacheContext>({
    mutationFn: ({ id }) => Api.Chat.Leave(id),
    invalidateKeys: [chatRootKey],
  });
}

export function useTransferOwnership() {
  return useAppMutation<
    ChatMemberInfo[],
    { id: string; payload: PickTransferOwnership },
    ChatCacheContext
  >({
    mutationFn: ({ id, payload }) => Api.Chat.TransferOwnership(id, payload),
    invalidateKeys: [chatRootKey],
  });
}
