import { CreditCard } from 'lucide-react';

import { Badge, CardContent, CardHeader, CardTitle, Separator } from '@/components/atoms';
import { GlassCard } from '@/components/molecules/GlassCard';

interface BillingPlan {
  tier: string;
  status: string;
  renewsAtText: string;
}

export function BillingWidget({ plan }: { plan?: BillingPlan | null }) {
  return (
    <GlassCard>
      <CardHeader className="px-5 pt-5 pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-semibold">Langganan & Tagihan</CardTitle>
          <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <CreditCard className="size-4" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 px-5 pb-5">
        {!plan ? (
          <p className="py-4 text-center text-xs text-muted-foreground">Belum ada langganan.</p>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs text-muted-foreground">Paket Aktif</span>
              <Badge variant="default" className="rounded-full px-2.5 py-0.5 text-[11px]">
                {plan.tier}
              </Badge>
            </div>
            <Separator className="opacity-50" />
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Status</span>
              <span className="text-sm font-medium capitalize">{plan.status}</span>
            </div>
            <Separator className="opacity-50" />
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Tanggal Perpanjangan</span>
              <span className="text-sm font-medium">{plan.renewsAtText}</span>
            </div>
          </div>
        )}

        <p className="text-[11px] leading-relaxed text-muted-foreground">
          Ganti paket via Super Admin.
        </p>
      </CardContent>
    </GlassCard>
  );
}
