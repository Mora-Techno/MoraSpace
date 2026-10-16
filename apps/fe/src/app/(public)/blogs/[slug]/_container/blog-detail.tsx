'use client';

import { useQuery } from '@tanstack/react-query';

import BlogDetailSection, {
  toBlogDetailVM,
} from '@/components/page/public/blog/blog-detail.section';
import Api from '@/services/api';

const BlogDetailContainer = ({ slug }: { slug: string }) => {
  const detailQuery = useQuery({
    queryKey: ['blog', 'detail', slug],
    queryFn: async () => {
      const res = await Api.Blog.GetPost(slug);
      return res.data;
    },
    staleTime: 1000 * 60 * 5,
    retry: false,
  });

  return (
    <BlogDetailSection
      service={{
        post: detailQuery.data ? toBlogDetailVM(detailQuery.data) : null,
        isLoading: detailQuery.isLoading,
        isError: detailQuery.isError,
      }}
    />
  );
};

export default BlogDetailContainer;
