'use client';
import { router, useLocalSearchParams } from 'expo-router';

import { BlogDetailSection } from '@/components/section/public/blog-detail.section';
import { useApi } from '@/hooks/service/useApi';

export function MobileBlogDetailContainer() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const api = useApi();
  const { data: post, isLoading, isError } = api.blog.query.post(slug);

  const words = (post?.content ?? '').split(/\s+/).filter(Boolean).length;

  return (
    <BlogDetailSection
      service={{
        post: post
          ? {
              category: post.category,
              title: post.title,
              excerpt: post.excerpt,
              metaLine: `${post.authorName} • ${Math.max(1, Math.round(words / 200))} mnt baca`,
              paragraphs: post.content.split(/\n\n+/),
            }
          : null,
        isLoading,
        isError,
        onBack: () => router.back(),
      }}
    />
  );
}
