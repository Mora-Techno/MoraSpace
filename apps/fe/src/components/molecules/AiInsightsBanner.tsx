import { BrainCircuit, ChevronRight } from "lucide-react";

import {
  Badge,
  Button,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/atoms";
import { GlassCard } from "@/components/molecules/GlassCard";

export function AiInsightsBanner() {
  return (
    <GlassCard className="relative overflow-hidden border-primary/20 bg-gradient-to-br from-primary/[0.04] via-background to-primary/[0.02] dark:from-primary/[0.06] dark:via-background dark:to-primary/[0.02]">
      {/* Glow accent */}
      <div className="pointer-events-none absolute -top-12 -right-12 size-48 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-8 -left-8 size-32 rounded-full bg-primary/5 blur-2xl" />

      <CardHeader className="relative px-6 pt-6 pb-3">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-primary/15 text-primary ring-1 ring-primary/20">
            <BrainCircuit className="size-5" />
          </div>
          <div>
            <CardTitle className="flex items-center gap-2 text-base font-semibold">
              AI Briefing
              <Badge
                variant="default"
                className="rounded-full px-2 py-0.5 text-[10px] font-normal"
              >
                Live
              </Badge>
            </CardTitle>
            <CardDescription className="text-xs">
              Wawasan otomatis untuk pemilik perusahaan
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="relative px-6 pb-6">
        <p className="text-sm leading-relaxed text-foreground/85">
          <span className="font-medium text-primary">Tim Engineering</span>{" "}
          mencapai efisiensi 92%, namun{" "}
          <span className="font-medium text-destructive">Tim Marketing</span>{" "}
          mengalami bottleneck pada 3 campaign utama. Disarankan meninjau ulang
          beban meeting mingguan dan mengalokasikan 2 engineer untuk
          mempercepat.
        </p>
        <Button
          variant="ghost"
          size="sm"
          className="mt-3 h-auto gap-1.5 p-0 text-xs font-medium text-primary hover:bg-transparent hover:text-primary/80"
        >
          Lihat detail analisis
          <ChevronRight className="size-3.5" />
        </Button>
      </CardContent>
    </GlassCard>
  );
}
