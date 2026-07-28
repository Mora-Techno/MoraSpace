import { ArrowUpRight, Banknote, CreditCard } from "lucide-react";

import {
  Button,
  CardContent,
  CardHeader,
  CardTitle,
  Separator,
} from "@/components/atoms";
import { GlassCard } from "@/components/molecules/GlassCard";

export function BillingWidget() {
  return (
    <GlassCard>
      <CardHeader className="px-5 pt-5 pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-semibold">
            Langganan & Tagihan
          </CardTitle>
          <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <CreditCard className="size-4" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 px-5 pb-5">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Paket</span>
            <span className="text-sm font-semibold">Pro Tier — Yearly</span>
          </div>
          <Separator className="opacity-50" />
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">
              Tanggal Perpanjangan
            </span>
            <span className="text-sm font-medium">15 Des 2025</span>
          </div>
          <Separator className="opacity-50" />
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">
              Pengeluaran Bulanan
            </span>
            <span className="text-sm font-semibold text-primary">
              Rp 2.450.000
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 rounded-xl bg-primary/[0.04] p-3 ring-1 ring-primary/10">
          <Banknote className="size-4 shrink-0 text-primary" />
          <p className="text-[11px] leading-relaxed text-muted-foreground">
            Upgrade ke Enterprise untuk unlimited seats, priority support, dan
            audit log.
          </p>
        </div>

        <Button
          variant="outline"
          className="w-full gap-1.5 rounded-xl text-xs font-medium"
        >
          Upgrade Plan
          <ArrowUpRight className="size-3.5" />
        </Button>
      </CardContent>
    </GlassCard>
  );
}
