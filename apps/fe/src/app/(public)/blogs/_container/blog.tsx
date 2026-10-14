'use client';

import { useQuery } from '@tanstack/react-query';

import BlogSection from '@/components/page/public/blog/HeroSection';
import NavLayout from '@/core/layouts/nav.layout';
import Api from '@/services/api';

const BlogsContainer = () => {
  const postsQuery = useQuery({
    queryKey: ['blog', 'list'],
    queryFn: async () => {
      const res = await Api.Blog.ListPosts({ limit: 50 });
      return {
        posts: res.data,
        categories: (res.meta as { categories?: string[] } | undefined)?.categories ?? [],
      };
    },
    staleTime: 1000 * 60 * 5,
  });

  return (
    <NavLayout>
      <main className="w-full min-h-screen">
        <BlogSection
          template={{
            desc: 'Initial Blogs',
            title: 'Blogs',
          }}
          data={{
            posts: postsQuery.data?.posts ?? [],
            categories: postsQuery.data?.categories ?? [],
            isLoading: postsQuery.isLoading,
            isError: postsQuery.isError,
            refetch: () => void postsQuery.refetch(),
          }}
        />
      </main>
    </NavLayout>
  );
};

export default BlogsContainer;
