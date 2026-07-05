"use client";

import { ArrowUpRight, Clock } from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/atoms";
import { useGsapStagger } from "@/hooks/useGsapStagger";

const ARTICLES = [
  {
    category: "Produktivitas",
    title: "5 Cara Mengatur Todo Harian Agar Tidak Overwhelming",
    excerpt:
      "Pelajari teknik prioritas dan time-blocking untuk menyelesaikan tugas tanpa stres.",
    date: "8 Jun 2026",
    gradient: "from-orange-600/40 to-amber-900/60",
  },
  {
    category: "Notes",
    title: "Bangun Second Brain dengan Catatan Terstruktur",
    excerpt:
      "Simpan ide dan referensi dengan sistem tagging yang mudah diakses kapan saja.",
    date: "5 Jun 2026",
    gradient: "from-amber-600/30 to-orange-900/50",
  },
  {
    category: "Fokus",
    title: "Playlist Lo-Fi Ghibli untuk Deep Work Session",
    excerpt:
      "Soundtrack Joe Hisaishi dan ambient music yang terbukti meningkatkan konsentrasi.",
    date: "1 Jun 2026",
    gradient: "from-yellow-600/20 to-orange-800/40",
  },
];

export function ShowcaseSection() {
  const ref = useGsapStagger<HTMLDivElement>([]);

  return (
    <section className="px-4 py-20 md:px-6 md:py-28">
      <div className="mx-auto max-w-5xl">
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="font-serif text-3xl font-bold text-white md:text-4xl">
              Artikel Terbaru
            </h2>
            <p className="mt-2 text-zinc-400">
              Insight produktivitas dan tips menggunakan MoraSpace.
            </p>
          </div>
          <Link
            href="/login"
            className="inline-flex items-center gap-1 text-sm text-orange-400 hover:text-orange-300"
          >
            Lihat semua <ArrowUpRight className="size-4" />
          </Link>
        </div>

        <div ref={ref} className="grid gap-6 md:grid-cols-3">
          {ARTICLES.map((article) => (
            <article
              key={article.title}
              data-stagger-item
              className="group overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] transition-all duration-300 hover:border-orange-500/25 hover:bg-white/[0.05]"
            >
              <div
                className={`flex h-44 items-end bg-gradient-to-br ${article.gradient} p-5`}
              >
                <Badge className="border-white/20 bg-black/30 text-zinc-200 backdrop-blur-sm">
                  {article.category}
                </Badge>
              </div>
              <div className="p-5">
                <h3 className="line-clamp-2 font-semibold leading-snug text-white transition-colors group-hover:text-orange-300">
                  {article.title}
                </h3>
                <p className="mt-2 line-clamp-2 text-sm text-zinc-500">
                  {article.excerpt}
                </p>
                <div className="mt-4 flex items-center gap-1.5 text-xs text-zinc-600">
                  <Clock className="size-3.5" />
                  {article.date}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
