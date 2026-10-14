import type {
  ChatConversationPreview,
  ChatConversationQuery,
  ChatMemberInfo,
  ChatMessagesPage,
  ChatMessagesQuery,
  ChatUserSearchQuery,
  ChatUserSearchResult,
} from '@repo/types';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';

import { queryKey } from '@/configs';
import { hasCompanyChatContext } from '@/hooks/useChatSocket';
import Api from '@/services/api';
import { loadAuthSession } from '@/utils/storage';

function hasCompany(): boolean {
  if (typeof window === 'undefined') return false;
  const token = loadAuthSession()?.accessToken ?? null;
  return hasCompanyChatContext(token);
}

export function useConversations(params?: ChatConversationQuery) {
  const isEnabled = hasCompany();
  return useQuery<ChatConversationPreview[]>({
    queryKey: [...queryKey.chat.conversations(), params ?? {}],
    queryFn: async () => {
      const res = await Api.Chat.ListConversations(params);
      return res.data;
    },
    enabled: isEnabled,
    staleTime: 1000 * 30,
  });
}

export function useChatMessages(conversationId: string | undefined, limit = 30) {
  const isEnabled = hasCompany();
  return useInfiniteQuery({
    queryKey: queryKey.chat.messages(conversationId ?? ''),
    queryFn: async ({
      pageParam,
    }: {
      pageParam: number | undefined;
    }): Promise<ChatMessagesPage> => {
      const res = await Api.Chat.ListMessages(conversationId as string, {
        cursor: pageParam,
        limit,
      } satisfies ChatMessagesQuery);
      return {
        data: res.data,
        nextCursor: (res.meta?.nextCursor as number | null | undefined) ?? null,
      };
    },
    initialPageParam: undefined as number | undefined,
    getNextPageParam: (lastPage: ChatMessagesPage) => lastPage.nextCursor ?? undefined,
    enabled: !!conversationId && isEnabled,
    staleTime: 1000 * 30,
  });
}

export function useChatMembers(conversationId: string | undefined) {
  const isEnabled = hasCompany();
  return useQuery<ChatMemberInfo[]>({
    queryKey: queryKey.chat.members(conversationId ?? ''),
    queryFn: async () => {
      const res = await Api.Chat.ListMembers(conversationId as string);
      return res.data;
    },
    enabled: !!conversationId && isEnabled,
    staleTime: 1000 * 30,
  });
}

export function useChatUserSearch(params?: ChatUserSearchQuery) {
  const isEnabled = hasCompany();
  return useQuery<ChatUserSearchResult[]>({
    queryKey: [...queryKey.chat.users(), params ?? {}],
    queryFn: async () => {
      const res = await Api.Chat.SearchUsers(params);
      return res.data;
    },
    enabled: isEnabled,
    staleTime: 1000 * 30,
  });
}
