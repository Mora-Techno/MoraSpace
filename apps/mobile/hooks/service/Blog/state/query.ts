import type { BlogListItem, BlogQuery, IBlogPost } from '@repo/types';
import { useQuery } from '@tanstack/react-query';

import { queryKey } from '@/config/query-key';
import Api from '@/service/props.service';

const blogRootKey = ['blog'] as const;

export function useBlogPosts(params?: BlogQuery) {
  return useQuery<BlogListItem[]>({
    queryKey: [...blogRootKey, 'list', params ?? {}],
    queryFn: async () => {
      const res = await Api.Blog.ListPosts(params);
      return res.data;
    },
    staleTime: 1000 * 60 * 5,
  });
}

export function useBlogPost(slug: string | undefined) {
  return useQuery<IBlogPost>({
    queryKey: [...blogRootKey, 'detail', slug ?? ''],
    queryFn: async () => {
      const res = await Api.Blog.GetPost(slug as string);
      return res.data;
    },
    enabled: !!slug,
    staleTime: 1000 * 60 * 5,
    retry: false,
  });
}
