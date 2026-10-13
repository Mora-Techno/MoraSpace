'use client';

import { ArrowRight, ArrowUpRight, BookOpen, Calendar, Clock, Mail, Search } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

import { Badge } from '@/components/atoms';
import {
  ScribbleArrow,
  ScribbleCircle,
  ScribbleSparkle,
  ScribbleUnderline,
} from '@/components/atoms/Scribbles';

interface BlogSectionProps {
  template?: {
    title: string;
    desc: string;
  };
}

const ARTICLES = [
  {
    title: '5 Cara Asisten AI Mora Menghemat 2 Jam Waktu Rapat Setiap Pekan',
    excerpt:
      'Pelajari bagaimana asisten cerdas berbasis konteks merangkum diskusi panjang menjadi butir tindakan konkret tanpa distraksi.',
    category: 'Asisten AI',
    author: 'Tim Spaces',
    date: '10 Okt 2026',
    readTime: '5 min baca',
    colorTint: 'from-primary/20 to-primary/5',
  },
  {
    title: 'Psikologi di Balik Mode Fokus: Mengapa Ritme Pomodoro Berhasil',
    excerpt:
      'Memahami bagaimana pembagian blok waktu dan batas sehat dapat mencegah kelelahan kognitif dan menjaga kejernihan berpikir.',
    category: 'Produktivitas Kalem',
    author: 'Dr. Sarah Amalia',
    date: '05 Okt 2026',
    readTime: '4 min baca',
    colorTint: 'from-amber-500/20 to-amber-500/5',
  },
  {
    title: 'Context Switching: Bahaya Terselubung di Balik Multitasking Digital',
    excerpt:
      'Bagaimana berpindah-pindah antara puluhan tab dan notifikasi perlahan mengikis rentang perhatian mendalam tim kreatif Anda.',
    category: 'Filosofi Kerja',
    author: 'Mulia Andiki',
    date: '28 Sep 2026',
    readTime: '7 min baca',
    colorTint: 'from-emerald-500/20 to-emerald-500/5',
  },
  {
    title: 'Pembaruan Fitur: Sinkronisasi Google Calendar yang Menghormati Jam Istirahat',
    excerpt:
      'Sekarang Anda dapat membiarkan Spaces menyusun agenda harian secara otomatis tanpa pernah mengorbankan waktu istirahat malam.',
    category: 'Pembaruan Produk',
    author: 'Tim Produk',
    date: '15 Sep 2026',
    readTime: '3 min baca',
    colorTint: 'from-blue-500/20 to-blue-500/5',
  },
  {
    title: 'Membangun Ruang Arsip Pengetahuan Tim yang Rapi dan Tidak Usang',
    excerpt:
      'Panduan menyusun dokumentasi asinkron agar anggota baru dapat mandiri memahami alur kerja tanpa perlu sesi onboarding berulang.',
    category: 'Manajemen Tim',
    author: 'Nadia Safira',
    date: '02 Sep 2026',
    readTime: '6 min baca',
    colorTint: 'from-purple-500/20 to-purple-500/5',
  },
  {
    title: 'Menemukan Kedamaian di Tengah Tenggat Waktu: Seni Beristirahat Tanpa Rasa Bersalah',
    excerpt:
      'Refleksi mengapa istirahat teratur bukan lawan dari produktivitas tinggi, melainkan bahan bakar utamanya.',
    category: 'Produktivitas Kalem',
    author: 'Rayhan Pratama',
    date: '20 Agu 2026',
    readTime: '5 min baca',
    colorTint: 'from-primary/25 to-secondary/10',
  },
];

export default function BlogSection({ template }: BlogSectionProps) {
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['Semua', 'Produktivitas Kalem', 'Asisten AI', 'Pembaruan Produk', 'Filosofi Kerja', 'Manajemen Tim'];

  const filteredArticles = ARTICLES.filter((article) => {
    const matchesCategory =
      selectedCategory === 'Semua' || article.category === selectedCategory;
    const matchesSearch =
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

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
            Kisah, Riset &{' '}
            <span className="relative inline-block text-primary">
              Wawasan
              <ScribbleUnderline className="absolute -bottom-4 left-0 w-full text-primary/70" />
            </span>
          </h1>

          <p className="mx-auto mt-7 max-w-2xl text-base md:text-lg text-muted-foreground leading-relaxed">
            Eksplorasi mendalam seputar desain ruang kerja yang menenangkan, filosofi fokus tanpa
            distraksi, dan masa depan kolaborasi digital.
          </p>

          {/* Search Bar */}
          <div className="mt-8 flex w-full max-w-md mx-auto items-center gap-2 rounded-full border border-border/70 bg-card/80 px-4 py-2 shadow-xs backdrop-blur-md focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/20">
            <Search className="size-4 text-muted-foreground shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari artikel, topik, atau kata kunci..."
              className="flex-1 bg-transparent text-xs sm:text-sm text-foreground outline-none placeholder:text-muted-foreground"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                Reset
              </button>
            )}
          </div>

          {/* Category Filter Pills */}
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all ${
                  selectedCategory === cat
                    ? 'bg-foreground text-background shadow-xs'
                    : 'border border-border/60 bg-card/60 text-muted-foreground hover:text-foreground hover:bg-card'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Featured Story Hero Card */}
        {selectedCategory === 'Semua' && !searchQuery && (
          <div className="mb-14 group relative overflow-hidden rounded-3xl border border-border/70 bg-card/70 backdrop-blur-md transition-all duration-300 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/10 grid grid-cols-1 md:grid-cols-12 gap-0">
            <div className="md:col-span-5 min-h-[260px] md:min-h-full bg-gradient-to-br from-primary/30 via-accent/20 to-card p-8 flex flex-col justify-between relative overflow-hidden">
              <div className="flex items-center gap-2">
                <Badge className="bg-primary text-primary-foreground border-none text-[11px] font-bold">
                  Cerita Utama Pekan Ini
                </Badge>
              </div>

              {/* Hand-drawn scribble decoration */}
              <div className="my-auto py-8 text-center relative">
                <ScribbleSparkle className="size-8 text-primary mx-auto mb-2 opacity-80" />
                <p className="font-serif italic text-lg text-foreground/85">
                  &ldquo;Kerja tenang bukan berarti lambat; ketenangan adalah landasan kecepatan yang berkelanjutan.&rdquo;
                </p>
                <ScribbleCircle className="absolute -inset-4 size-[120%] text-primary/30 pointer-events-none" />
              </div>

              <div className="text-[11px] text-muted-foreground">Spaces Editorial • Edisi #42</div>
            </div>

            <div className="md:col-span-7 p-8 sm:p-12 flex flex-col justify-center">
              <div className="flex items-center gap-3 text-xs text-muted-foreground mb-4">
                <span className="font-semibold text-primary">Filosofi Kerja</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Calendar className="size-3.5" /> 12 Okt 2026
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock className="size-3.5" /> 8 min baca
                </span>
              </div>

              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-foreground mb-4 group-hover:text-primary transition-colors leading-snug">
                Membangun Budaya Kerja Sehat Tanpa Kehilangan Daya Saing & Inovasi
              </h2>

              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed mb-6">
                Mitos bahwa tim hebat harus begadang setiap hari perlahan dipatahkan oleh riset modern.
                Pelajari kerangka kerja 3 batas yang diterapkan di Spaces untuk menghormati jam istirahat
                anggota tanpa pernah mengorbankan kualitas rilis.
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
                  Baca Ulasan <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Article Cards Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredArticles.map((article) => (
            <article
              key={article.title}
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
                  <span>Baca</span>
                  <ArrowUpRight className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
              </div>
            </article>
          ))}
        </div>

        {filteredArticles.length === 0 && (
          <div className="text-center py-16 rounded-3xl border border-border/60 bg-card/40">
            <p className="text-sm font-semibold text-foreground">Tidak ada artikel yang cocok</p>
            <p className="text-xs text-muted-foreground mt-1">
              Coba gunakan kata kunci pencarian yang berbeda atau pilih kategori lain.
            </p>
          </div>
        )}

        {/* Newsletter Subscription Card with Hand-Drawn Doodle */}
        <div className="mt-20 rounded-3xl border border-border/70 bg-card/80 p-8 sm:p-12 relative overflow-hidden backdrop-blur-md text-center max-w-3xl mx-auto">
          <div className="relative z-10">
            <div className="inline-flex items-center gap-1.5 text-primary text-xs font-semibold mb-3">
              <Mail className="size-4" />
              <span>Buletin Mingguan Kalem</span>
            </div>

            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-foreground mb-3">
              Wawasan produktivitas terkurasi langsung ke surel Anda.
            </h2>

            <p className="text-xs sm:text-sm text-muted-foreground max-w-lg mx-auto mb-8 leading-relaxed">
              Terkirim tiap Selasa pagi. Tanpa spam, tanpa promosi agresif, hanya rangkuman artikel
              terbaik dan tips ritual kerja sehat.
            </p>

            <form
              onSubmit={(e) => e.preventDefault()}
              className="flex flex-col sm:flex-row items-center gap-2.5 max-w-md mx-auto"
            >
              <input
                type="email"
                placeholder="nama@perusahaan.com"
                aria-label="Alamat email Anda"
                className="w-full rounded-full border border-border/70 bg-background/80 px-4 py-2.5 text-xs text-foreground outline-none focus:border-primary/60"
              />
              <button
                type="submit"
                className="w-full sm:w-auto shrink-0 rounded-full bg-primary px-6 py-2.5 text-xs font-semibold text-primary-foreground shadow-xs hover:opacity-90 transition-opacity"
              >
                Langganan Gratis
              </button>
            </form>

            <div className="mt-4 flex items-center justify-center gap-1 text-[11px] text-muted-foreground">
              <ScribbleArrow className="size-4 text-primary rotate-[-10deg]" />
              <span>Bisa berhenti berlangganan kapan saja dalam satu klik.</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
