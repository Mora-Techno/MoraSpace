import { queryKey } from '@/configs';

export type ChatCacheContext = {
  previousData?: unknown;
};

export const chatRootKey = queryKey.chatRoot();
