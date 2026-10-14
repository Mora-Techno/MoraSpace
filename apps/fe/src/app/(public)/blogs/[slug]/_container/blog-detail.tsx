'use client';

import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Calendar, Clock } from 'lucide-react';
import Link from 'next/link';

import { Badge } from '@/components/atoms';
import NavLayout from '@/core/layouts/nav.layout';
import Api from '@/services/api';

function readTimeOf(content: string) {
  const words = content.split(/\s+/).filter(Boolean).length;
  return `${Math.max(1, Math.round(words / 200))} mnt baca`;
}

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

  const post = detailQuery.data;

  return (
    <NavLayout>
      <main className="w-full min-h-screen">
        <article className="mx-auto max-w-3xl px-4 pt-24 md:pt-32 pb-24">
          <Link
            href="/blogs"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground mb-8"
          >
            <ArrowLeft className="size-3.5" /> Semua artikel
          </Link>

          {detailQuery.isLoading ? (
            <div className="space-y-4 animate-pulse">
              <div className="h-4 w-24 rounded bg-muted" />
              <div className="h-9 w-full rounded bg-muted" />
              <div className="h-4 w-2/3 rounded bg-muted" />
              <div className="h-40 w-full rounded bg-muted" />
            </div>
          ) : detailQuery.isError || !post ? (
            <div className="text-center py-16 rounded-3xl border border-border/60 bg-card/40 space-y-2">
              <p className="text-sm font-semibold text-foreground">Artikel tidak ditemukan.</p>
              <p className="text-xs text-muted-foreground">
                Mungkin belum dipublikasikan atau tautan salah.
              </p>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-2 mb-4">
                <Badge className="bg-primary/10 text-primary border-primary/20 border text-[11px]">
                  {post.category}
                </Badge>
              </div>
              <h1 className="font-serif text-3xl md:text-5xl font-extrabold tracking-tight leading-tight mb-4">
                {post.title}
              </h1>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed mb-6">
                {post.excerpt}
              </p>
              <div className="flex items-center gap-4 text-xs text-muted-foreground pb-8 mb-8 border-b border-border/50">
                <span className="font-semibold text-foreground">{post.authorName}</span>
                <span className="flex items-center gap-1">
                  <Calendar className="size-3.5" />
                  {post.publishedAt
                    ? new Date(post.publishedAt).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })
                    : ''}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="size-3.5" /> {readTimeOf(post.content)}
                </span>
              </div>
              <div className="space-y-5">
                {post.content.split(/\n\n+/).map((para, i) => (
                  <p key={i} className="text-sm md:text-base text-foreground/90 leading-loose">
                    {para}
                  </p>
                ))}
              </div>
            </>
          )}
        </article>
      </main>
    </NavLayout>
  );
};

export default BlogDetailContainer;
