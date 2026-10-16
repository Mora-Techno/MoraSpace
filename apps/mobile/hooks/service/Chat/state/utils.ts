import { queryKey } from '@/config/query-key';

export type ChatCacheContext = {
  previousData?: unknown;
};

export const chatRootKey = queryKey.chatRoot();
