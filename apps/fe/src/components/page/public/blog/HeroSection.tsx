'use client';

import { ArrowRight, ArrowUpRight, Calendar, Clock, Mail, Search } from 'lucide-react';
import Link from 'next/link';
import { useMemo, useState } from 'react';

import { Badge } from '@/components/atoms';
import {
  ScribbleArrow,
  ScribbleCircle,
  ScribbleSparkle,
  ScribbleUnderline,
} from '@/components/atoms/Scribbles';
import { useTranslation } from '@/pkg/i18n';

interface BlogSectionProps {
  template?: {
    title: string;
    desc: string;
  };
}

interface ArticleItem {
  id: number;
  title: string;
  excerpt: string;
  category: string;
  author: string;
  date: string;
  readTime: string;
}

export default function BlogSection({ template: _template }: BlogSectionProps) {
  const { t } = useTranslation('public');

  const catAll = t('blogs.cat_all');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = useMemo(
    () => [
      { id: 'ALL', label: t('blogs.cat_all') },
      { id: 'CALM', label: t('blogs.cat_calm') },
      { id: 'AI', label: t('blogs.cat_ai') },
      { id: 'PRODUCT', label: t('blogs.cat_product') },
      { id: 'PHILOSOPHY', label: t('blogs.cat_philosophy') },
      { id: 'TEAM', label: t('blogs.cat_team') },
    ],
    [t],
  );

  const rawArticles = (t('blogs.articles', { returnObjects: true }) as ArticleItem[]) || [];

  const articles = useMemo(() => {
    return Array.isArray(rawArticles) ? rawArticles : [];
  }, [rawArticles]);

  const filteredArticles = useMemo(() => {
    const activeCatObj = categories.find((c) => c.id === selectedCategory);
    const activeLabel = activeCatObj ? activeCatObj.label : catAll;

    return articles.filter((article) => {
      const matchesCategory =
        selectedCategory === 'ALL' ||
        article.category === activeLabel ||
        article.category.toLowerCase() === activeLabel.toLowerCase();

      const matchesSearch =
        !searchQuery ||
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.excerpt.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }, [articles, selectedCategory, searchQuery, categories, catAll]);

  return (
    <section className="relative px-4 pb-32 pt-24 md:px-8 md:pt-32 min-h-screen">
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden">
        <div className="absolute left-1/2 top-10 -translate-x-1/2 h-[500px] w-[800px] rounded-full bg-primary/10 blur-[130px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl">
        {/* Header Title with Scribbles */}
        <div className="mb-14 text-center max-w-3xl mx-auto">
          <h1 className="font-serif text-4xl font-extrabold text-foreground md:text-6xl tracking-tight relative inline-block">
            {t('blogs.title_prefix')}{' '}
            <span className="relative inline-block text-primary">
              {t('blogs.title_highlight')}
              <ScribbleUnderline className="absolute -bottom-4 left-0 w-full text-primary/70" />
            </span>
          </h1>

          <p className="mx-auto mt-7 max-w-2xl text-base md:text-lg text-muted-foreground leading-relaxed">
            {t('blogs.subtitle')}
          </p>

          {/* Search Bar */}
          <div className="mt-8 flex w-full max-w-md mx-auto items-center gap-2 rounded-full border border-border/70 bg-card/80 px-4 py-2 shadow-xs backdrop-blur-md focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/20">
            <Search className="size-4 text-muted-foreground shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('blogs.search_placeholder')}
              className="flex-1 bg-transparent text-xs sm:text-sm text-foreground outline-none placeholder:text-muted-foreground"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="text-xs text-muted-foreground hover:text-foreground cursor-pointer"
              >
                {t('blogs.reset')}
              </button>
            )}
          </div>

          {/* Category Filter Pills */}
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-foreground text-background shadow-xs'
                    : 'border border-border/60 bg-card/60 text-muted-foreground hover:text-foreground hover:bg-card'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Featured Story Hero Card */}
        {selectedCategory === 'ALL' && !searchQuery && (
          <div className="mb-14 group relative overflow-hidden rounded-3xl border border-border/70 bg-card/70 backdrop-blur-md transition-all duration-300 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/10 grid grid-cols-1 md:grid-cols-12 gap-0">
            <div className="md:col-span-5 min-h-[260px] md:min-h-full bg-gradient-to-br from-primary/30 via-accent/20 to-card p-8 flex flex-col justify-between relative overflow-hidden">
              <div className="flex items-center gap-2">
                <Badge className="bg-primary text-primary-foreground border-none text-[11px] font-bold">
                  {t('blogs.featured_badge')}
                </Badge>
              </div>

              {/* Hand-drawn scribble decoration */}
              <div className="my-auto py-8 text-center relative">
                <ScribbleSparkle className="size-8 text-primary mx-auto mb-2 opacity-80" />
                <p className="font-serif italic text-lg text-foreground/85">
                  {t('blogs.featured_quote')}
                </p>
                <ScribbleCircle className="absolute -inset-4 size-[120%] text-primary/30 pointer-events-none" />
              </div>

              <div className="text-[11px] text-muted-foreground">{t('blogs.featured_edition')}</div>
            </div>

            <div className="md:col-span-7 p-8 sm:p-12 flex flex-col justify-center">
              <div className="flex items-center gap-3 text-xs text-muted-foreground mb-4">
                <span className="font-semibold text-primary">{t('blogs.cat_philosophy')}</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Calendar className="size-3.5" /> 12 Okt 2026
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock className="size-3.5" /> {t('blogs.featured_read_time')}
                </span>
              </div>

              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-foreground mb-4 group-hover:text-primary transition-colors leading-snug">
                {t('blogs.featured_title')}
              </h2>

              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed mb-6">
                {t('blogs.featured_excerpt')}
              </p>

              <div className="flex items-center justify-between pt-4 border-t border-border/50">
                <div className="flex items-center gap-2.5">
                  <div className="size-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-xs">
                    MA
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-foreground">Mulia Andiki</p>
                    <p className="text-[11px] text-muted-foreground">Founder, Spaces by Mora</p>
                  </div>
                </div>

                <Link
                  href="#"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
                >
                  {t('blogs.read_review')}{' '}
                  <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Article Cards Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredArticles.map((article) => (
            <article
              key={article.id || article.title}
              className="group flex flex-col justify-between rounded-3xl border border-border/70 bg-card/60 p-6 sm:p-7 backdrop-blur-sm transition-all duration-300 hover:border-primary/40 hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/5"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-4">
                  <span className="rounded-full bg-primary/10 border border-primary/20 px-2.5 py-0.5 text-[11px] font-semibold text-primary">
                    {article.category}
                  </span>
                  <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                    <Clock className="size-3" />
                    <span>{article.readTime}</span>
                  </div>
                </div>

                <h3 className="font-serif text-lg font-bold text-foreground mb-2.5 group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                  {article.title}
                </h3>

                <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3 mb-6">
                  {article.excerpt}
                </p>
              </div>

              <div className="pt-4 border-t border-border/50 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-muted-foreground text-[11px]">
                  <Calendar className="size-3" />
                  <span>{article.date}</span>
                </div>

                <Link
                  href="#"
                  className="inline-flex items-center gap-1 font-semibold text-foreground group-hover:text-primary transition-colors text-xs"
                >
                  <span>{t('blogs.read_article')}</span>
                  <ArrowUpRight className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
              </div>
            </article>
          ))}
        </div>

        {filteredArticles.length === 0 && (
          <div className="text-center py-16 rounded-3xl border border-border/60 bg-card/40">
            <p className="text-sm font-semibold text-foreground">{t('blogs.empty_title')}</p>
            <p className="text-xs text-muted-foreground mt-1">{t('blogs.empty_desc')}</p>
          </div>
        )}

        {/* Newsletter Subscription Card with Hand-Drawn Doodle */}
        <div className="mt-20 rounded-3xl border border-border/70 bg-card/80 p-8 sm:p-12 relative overflow-hidden backdrop-blur-md text-center max-w-3xl mx-auto">
          <div className="relative z-10">
            <div className="inline-flex items-center gap-1.5 text-primary text-xs font-semibold mb-3">
              <Mail className="size-4" />
              <span>{t('blogs.newsletter_tag')}</span>
            </div>

            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-foreground mb-3">
              {t('blogs.newsletter_title')}
            </h2>

            <p className="text-xs sm:text-sm text-muted-foreground max-w-lg mx-auto mb-8 leading-relaxed">
              {t('blogs.newsletter_desc')}
            </p>

            <form
              onSubmit={(e) => e.preventDefault()}
              className="flex flex-col sm:flex-row items-center gap-2.5 max-w-md mx-auto"
            >
              <input
                type="email"
                placeholder="nama@perusahaan.com"
                aria-label="Email"
                className="w-full rounded-full border border-border/70 bg-background/80 px-4 py-2.5 text-xs text-foreground outline-none focus:border-primary/60"
              />
              <button
                type="submit"
                className="w-full sm:w-auto shrink-0 rounded-full bg-primary px-6 py-2.5 text-xs font-semibold text-primary-foreground shadow-xs hover:opacity-90 transition-opacity cursor-pointer"
              >
                {t('blogs.newsletter_btn')}
              </button>
            </form>

            <div className="mt-4 flex items-center justify-center gap-1 text-[11px] text-muted-foreground">
              <ScribbleArrow className="size-4 text-primary rotate-[-10deg]" />
              <span>{t('blogs.newsletter_note')}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
