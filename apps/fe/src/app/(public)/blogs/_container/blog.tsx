'use client';

import { useQuery } from '@tanstack/react-query';
import { useMemo, useState } from 'react';

import BlogSection, { type BlogArticleVM } from '@/components/page/public/blog/HeroSection';
import NavLayout from '@/core/layouts/nav.layout';
import { useTranslation } from '@/pkg/i18n';
import Api from '@/services/api';

function toVM(p: {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  authorName: string;
  publishedAt: string | null;
  createdAt: string;
}): BlogArticleVM {
  const words = p.excerpt.split(/\s+/).filter(Boolean).length;
  return {
    id: p.id,
    slug: p.slug,
    title: p.title,
    excerpt: p.excerpt,
    category: p.category,
    authorName: p.authorName,
    initials: !p.authorName
      ? '?'
      : p.authorName
          .split(' ')
          .map((w) => w[0])
          .slice(0, 2)
          .join('')
          .toUpperCase(),
    dateText: p.publishedAt
      ? new Date(p.publishedAt).toLocaleDateString('id-ID', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        })
      : '',
    readTime: `${Math.max(1, Math.round(words / 200))} mnt baca`,
  };
}

const BlogsContainer = () => {
  const { t } = useTranslation('public');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

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

  const posts = useMemo(() => postsQuery.data?.posts ?? [], [postsQuery.data?.posts]);
  const categories = useMemo(
    () => [
      { id: 'ALL', label: t('blogs.cat_all') },
      ...(postsQuery.data?.categories ?? []).map((c) => ({ id: c, label: c })),
    ],
    [t, postsQuery.data?.categories],
  );

  const filtered = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return posts.filter((article) => {
      const matchesCategory = selectedCategory === 'ALL' || article.category === selectedCategory;
      const matchesSearch =
        !q || article.title.toLowerCase().includes(q) || article.excerpt.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [posts, selectedCategory, searchQuery]);

  const showFeatured = selectedCategory === 'ALL' && !searchQuery && filtered.length > 0;
  const grid = showFeatured ? filtered.slice(1) : filtered;

  return (
    <NavLayout>
      <main className="w-full min-h-screen">
        <BlogSection
          service={{
            categories,
            showFeatured,
            featured: showFeatured ? toVM(filtered[0]) : null,
            gridArticles: grid.map(toVM),
            isEmpty: filtered.length === 0,
            isLoading: postsQuery.isLoading,
            isError: postsQuery.isError,
            onSelectCategory: setSelectedCategory,
            onRetry: () => postsQuery.refetch(),
          }}
          state={{
            searchQuery,
            setSearchQuery,
            selectedCategory,
            setSelectedCategory,
          }}
        />
      </main>
    </NavLayout>
  );
};

export default BlogsContainer;
