'use client';

import { ArrowRight, Calendar, Clock, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

import { Badge } from '@/components/atoms';

interface BlogSectionProps {
  template: {
    title: string;
    desc: string;
  };
}

const ARTICLES = [
  {
    title: '5 Cara Spaces AI Membantu Menghemat 2 Jam Waktu Rapat Anda',
    excerpt: 'Pelajari bagaimana asisten cerdas kami dapat merangkum diskusi panjang menjadi poin aksi yang konkret.',
    category: 'AI Assistant',
    author: 'Tim Spaces',
    date: '10 Jul 2026',
    readTime: '5 min read',
    imageGradient: 'from-primary/40 to-secondary/30',
  },
  {
    title: 'Psikologi di Balik Mode Fokus: Mengapa Pomodoro Efektif?',
    excerpt: 'Memahami bagaimana pembagian waktu dapat mengurangi kelelahan mental dan meningkatkan work-life balance.',
    category: 'Produktivitas',
    author: 'Dr. Sarah',
    date: '5 Jul 2026',
    readTime: '4 min read',
    imageGradient: 'from-secondary/50 to-accent/40',
  },
  {
    title: 'Context Switching: Musuh Tersembunyi Kinerja Tim Anda',
    excerpt: 'Bagaimana berpindah-pindah antara 10 aplikasi berbeda perlahan menghancurkan fokus tim Anda.',
    category: 'Manajemen',
    author: 'Mulia Andiki',
    date: '28 Jun 2026',
    readTime: '7 min read',
    imageGradient: 'from-accent/50 to-primary/20',
  },
  {
    title: 'Rilis Fitur: Sinkronisasi Google Calendar yang Lebih Pintar',
    excerpt: 'Sekarang Anda dapat membiarkan Spaces secara otomatis mengatur ulang tugas Anda berdasarkan ketersediaan di kalender.',
    category: 'Product Update',
    author: 'Tim Product',
    date: '15 Jun 2026',
    readTime: '3 min read',
    imageGradient: 'from-primary/30 to-accent/30',
  },
];

const BlogSection: React.FC<BlogSectionProps> = () => {
  return (
    <section className="relative px-4 pb-32 pt-24 md:px-6 md:pt-32 min-h-screen">
      <div className="relative z-10 mx-auto max-w-6xl">
        <div className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-border/50 pb-8">
          <div className="max-w-2xl">
            <h1 className="font-serif text-4xl font-extrabold text-foreground md:text-6xl tracking-tight">
              Kisah & <span className="text-primary">Wawasan</span>
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Jelajahi panduan produktivitas sehat, pembaruan fitur, dan cerita tentang masa depan pekerjaan.
            </p>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
             {['Semua', 'Produktivitas', 'AI Assistant', 'Product Update', 'Manajemen'].map((tag, i) => (
                <button key={tag} className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-all duration-300 ${i === 0 ? 'bg-foreground text-background' : 'bg-secondary/50 text-muted-foreground hover:bg-secondary'}`}>
                  {tag}
                </button>
             ))}
          </div>
        </div>

        {/* Featured Article */}
        <div className="mb-16 group relative overflow-hidden rounded-[2.5rem] border border-border/50 bg-card/30 backdrop-blur-md transition-all duration-300 hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/10 flex flex-col md:flex-row">
          <div className="md:w-1/2 min-h-[300px] bg-gradient-to-br from-primary/30 to-accent/40 relative overflow-hidden">
            <div className="absolute inset-0 bg-black/10 mix-blend-overlay transition-transform duration-700 group-hover:scale-105" />
          </div>
          <div className="p-8 md:p-12 md:w-1/2 flex flex-col justify-center">
            <Badge className="w-fit mb-4 backdrop-blur-md bg-primary/10 text-primary border-primary/20">Panduan Lengkap</Badge>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4 group-hover:text-primary transition-colors duration-300">
              Membangun Budaya Kerja Sehat Tanpa Kehilangan Kecepatan
            </h2>
            <p className="text-muted-foreground text-lg mb-8 line-clamp-3">
              Mitos bahwa tim harus bekerja hingga larut malam untuk sukses perlahan dipatahkan. Pelajari kerangka kerja yang kami gunakan di Spaces untuk menghormati jam kerja sambil melampaui target Q3.
            </p>
            <Link href="/blog/membangun-budaya-kerja" className="inline-flex items-center text-primary font-semibold hover:text-primary/80 transition-colors duration-300">
              Baca Selengkapnya <ArrowRight className="ml-2 size-5 transition-transform group-hover:translate-x-2" />
            </Link>
          </div>
        </div>

        {/* Article Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-2">
          {ARTICLES.map((article) => (
            <article key={article.title} className="group flex flex-col rounded-3xl border border-border/50 bg-card/20 backdrop-blur-sm overflow-hidden transition-all duration-300 hover:bg-card/40 hover:-translate-y-1">
              <div className={`h-48 w-full bg-gradient-to-br ${article.imageGradient} relative overflow-hidden`}>
                <div className="absolute inset-0 bg-black/5 mix-blend-overlay transition-transform duration-700 group-hover:scale-105" />
                <Badge className="absolute top-4 left-4 backdrop-blur-md bg-background/50 text-foreground border-white/20">
                  {article.category}
                </Badge>
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex items-center gap-4 text-xs font-medium text-muted-foreground mb-3">
                  <span>{article.author}</span>
                  <div className="size-1 rounded-full bg-border" />
                  <span className="flex items-center gap-1"><Calendar className="size-3.5" /> {article.date}</span>
                  <div className="size-1 rounded-full bg-border" />
                  <span className="flex items-center gap-1"><Clock className="size-3.5" /> {article.readTime}</span>
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors duration-300 line-clamp-2">
                  {article.title}
                </h3>
                <p className="text-muted-foreground mb-6 line-clamp-2 flex-1">
                  {article.excerpt}
                </p>
                <Link href="#" className="inline-flex items-center justify-between border-t border-border/50 pt-4 w-full text-sm font-semibold text-foreground group-hover:text-primary transition-colors duration-300">
                  Baca Artikel <ArrowUpRight className="size-4" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BlogSection;
