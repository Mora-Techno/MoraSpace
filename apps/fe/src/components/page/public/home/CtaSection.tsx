"use client";

import { ArrowRight, Mail } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/atoms";

export function CtaSection() {
  return (
    <section className="px-4 pb-24 pt-8 md:px-6">
      <div className="relative mx-auto max-w-5xl overflow-hidden rounded-3xl border border-orange-500/20 bg-gradient-to-br from-orange-500/10 via-amber-500/5 to-transparent p-8 md:p-14">
        <div className="pointer-events-none absolute -right-20 -top-20 size-64 rounded-full bg-orange-500/20 blur-[80px]" />

        <div className="relative text-center">
          <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-orange-500/20 text-orange-400">
            <Mail className="size-7" />
          </div>
          <h2 className="font-serif text-2xl font-bold text-white md:text-4xl">
            Tetap Update dengan Tips Produktivitas
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-zinc-400">
            Daftar sekarang dan mulai kelola hidup digitalmu dengan MoraSpace —
            PWA produktivitas dengan nuansa FutureTech.
          </p>

          <div className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row">
            <input
              type="email"
              placeholder="email@kamu.com"
              className="flex-1 rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none placeholder:text-zinc-500 focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/30"
            />
            <Button
              asChild
              className="rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 px-6 text-white hover:from-orange-400 hover:to-amber-400"
            >
              <Link href="/register">
                Berlangganan <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
