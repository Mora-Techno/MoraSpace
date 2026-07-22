"use client";

import { Search, Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/atoms";
import { Badge } from "@/components/atoms";
import { useGsapStagger } from "@/hooks/useGsapStagger";

const TAGS = ["Produktivitas", "Tasks", "Notes", "Kalender", "Fokus", "Music"];

export function HeroSection() {
  const ref = useGsapStagger<HTMLDivElement>([]);

  return (
    <section className="relative overflow-hidden px-4 pb-20 pt-16 md:px-6 md:pb-32 md:pt-24">
      {/* Decorative background blur elements */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e6e6e6_1px,transparent_1px),linear-gradient(to_bottom,#e6e6e6_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-40 dark:opacity-10" />
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="absolute left-[10%] top-[20%] size-[500px] rounded-full bg-primary/20 blur-[120px] animate-pulse" />
        <div className="absolute right-[10%] top-[40%] size-[400px] rounded-full bg-secondary/30 blur-[100px] opacity-70" />
      </div>

      <div ref={ref} className="relative z-10 mx-auto max-w-5xl text-center">
        <div data-stagger-item className="flex justify-center mb-8">
          <Badge className="backdrop-blur-md bg-primary/10 border-primary/20 text-primary-foreground/80 dark:text-primary py-1.5 px-4 flex items-center gap-2 rounded-full">
            <Sparkles className="size-4" />
            <span className="font-medium">
              Spaces 1.0 - One Workspace. Better Work.
            </span>
          </Badge>
        </div>

        <h1
          data-stagger-item
          className="font-serif text-5xl font-extrabold leading-tight tracking-tight md:text-7xl lg:text-8xl text-foreground"
        >
          Sistem Operasi untuk{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent-foreground">
            Tim Modern
          </span>
        </h1>

        <p
          data-stagger-item
          className="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-muted-foreground md:text-xl font-medium"
        >
          Satukan komunikasi, manajemen tugas, kalender, dan asisten AI dalam
          satu ekosistem yang dirancang untuk fokus dan produktivitas sehat.
        </p>

        <div
          data-stagger-item
          className="mx-auto mt-12 flex max-w-xl items-center gap-3 rounded-full border border-border/50 bg-card/60 p-2 shadow-2xl shadow-primary/5 backdrop-blur-xl transition-all duration-300 focus-within:border-primary/50 focus-within:ring-4 focus-within:ring-primary/10"
        >
          <Search className="ml-4 size-5 text-muted-foreground shrink-0" />
          <input
            type="text"
            placeholder="Cari fitur seperti 'Pomodoro' atau 'AI Meeting'..."
            className="flex-1 bg-transparent py-3 text-base text-foreground outline-none placeholder:text-muted-foreground/70"
          />
          <Button
            asChild
            className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-6 text-base font-semibold shadow-lg shadow-primary/20 transition-all duration-300 hover:scale-105"
          >
            <Link href="/login">
              Mulai Gratis <ArrowRight className="ml-2 size-5" />
            </Link>
          </Button>
        </div>

        <div
          data-stagger-item
          className="mt-12 flex flex-wrap items-center justify-center gap-3"
        >
          {TAGS.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-border/50 bg-background/50 px-5 py-2 text-sm text-muted-foreground backdrop-blur-sm cursor-pointer transition-all duration-300 hover:border-primary/40 hover:text-primary hover:bg-primary/5 shadow-sm"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
