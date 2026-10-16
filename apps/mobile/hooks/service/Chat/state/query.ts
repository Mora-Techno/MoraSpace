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

import { queryKey } from '@/config/query-key';
import Api from '@/service/props.service';

export function useConversations(params?: ChatConversationQuery) {
  return useQuery<ChatConversationPreview[]>({
    queryKey: [...queryKey.chat.conversations(), params ?? {}],
    queryFn: async () => {
      const res = await Api.Chat.ListConversations(params);
      return res.data;
    },
    staleTime: 30_000,
  });
}

export function useChatMessages(conversationId: string | undefined, limit = 30) {
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
    enabled: !!conversationId,
    staleTime: 30_000,
  });
}

export function useChatMembers(conversationId: string | undefined) {
  return useQuery<ChatMemberInfo[]>({
    queryKey: queryKey.chat.members(conversationId ?? ''),
    queryFn: async () => {
      const res = await Api.Chat.ListMembers(conversationId as string);
      return res.data;
    },
    enabled: !!conversationId,
    staleTime: 30_000,
  });
}

export function useChatUserSearch(params?: ChatUserSearchQuery) {
  return useQuery<ChatUserSearchResult[]>({
    queryKey: [...queryKey.chat.users(), params ?? {}],
    queryFn: async () => {
      const res = await Api.Chat.SearchUsers(params);
      return res.data;
    },
    staleTime: 30_000,
  });
}
