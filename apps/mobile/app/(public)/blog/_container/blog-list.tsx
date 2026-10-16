'use client';
import { router } from 'expo-router';
import { useMemo, useState } from 'react';

import { BlogListSection } from '@/components/section/public/blog-list.section';
import { useApi } from '@/hooks/service/useApi';

function toCardVM(p: {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  authorName: string;
  publishedAt: string | null;
  createdAt: string;
}) {
  const words = p.excerpt.split(/\s+/).filter(Boolean).length;
  const d = new Date(p.publishedAt || p.createdAt);
  return {
    id: p.id,
    slug: p.slug,
    title: p.title,
    excerpt: p.excerpt,
    category: p.category,
    metaLine: `${p.authorName} • ${d.getDate()} ${d.toLocaleString('id-ID', { month: 'short' })} ${d.getFullYear()}`,
    readTime: `${Math.max(1, Math.round(words / 200))} mnt baca`,
  };
}

export function MobileBlogListContainer() {
  const api = useApi();
  const [filter, setFilter] = useState('');
  const [category, setCategory] = useState<string | null>(null);

  const { data = [], isLoading, isError, refetch } = api.blog.query.posts({ limit: 50 });
  const categories = useMemo(() => {
    const set = new Set<string>();
    for (const p of data) if (p.category) set.add(p.category);
    return [...set].sort();
  }, [data]);

  const filtered = useMemo(() => {
    const q = filter.trim().toLowerCase();
    return data.filter(
      (p) =>
        (!category || p.category === category) &&
        (!q || p.title.toLowerCase().includes(q) || p.excerpt.toLowerCase().includes(q)),
    );
  }, [data, filter, category]);

  return (
    <BlogListSection
      service={{
        categories,
        articles: filtered.map(toCardVM),
        isLoading,
        isError,
        selectedCategory: category,
        onSelectCategory: setCategory,
        onOpenArticle: (slug) => router.push(`/(public)/blog/${slug}` as any),
        onRetry: () => refetch(),
      }}
      state={{ filter, setFilter }}
    />
  );
}
