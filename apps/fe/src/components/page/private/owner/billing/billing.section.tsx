import React from "react";
import { Check, CreditCard, Sparkles } from "lucide-react";
import { PageHeader } from "@/components/molecules/PageHeader";
import { Button, Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/atoms";
import type { SubscriptionTier } from "@/types/api/subscription";

export interface BillingSectionProps {
  service: {
    mySub: any;
    plans: any[];
    isPlansLoading: boolean;
    handleCheckout: (tier: SubscriptionTier) => void;
    handleCancel: () => void;
    isCheckoutPending: boolean;
    isCancelPending: boolean;
  };
}

export const BillingSection: React.FC<BillingSectionProps> = ({
  service: {
    mySub,
    plans,
    isPlansLoading,
    handleCheckout,
    handleCancel,
    isCheckoutPending,
    isCancelPending,
  },
}) => {
  return (
    <div className="w-full space-y-8 max-w-6xl mx-auto">
      <PageHeader
        title="Billing & Subscription"
        description="Kelola paket langganan workspace dan metode pembayaran perusahaanmu."
      />

      {/* Status Subscription Saat Ini */}
      <Card className="flex flex-col md:flex-row md:items-center justify-between p-6 gap-6">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-blue-500/10 text-blue-600 rounded-xl">
            <CreditCard className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
                Paket Aktif: {mySub?.tier ? String(mySub.tier).toUpperCase() : "FREE"}
              </h3>
              <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400">
                {mySub?.status ? String(mySub.status).toUpperCase() : "ACTIVE"}
              </span>
            </div>
            <p className="text-xs text-neutral-500 mt-1">
              {mySub?.currentPeriodEnd
                ? `Berlaku hingga ${new Date(mySub.currentPeriodEnd).toLocaleDateString()}`
                : "Nikmati fitur dasar produktivitas Spaces."}
            </p>
          </div>
        </div>

        {mySub?.status === "active" && (
          <Button
            onClick={handleCancel}
            disabled={isCancelPending}
            variant="destructive"
            size="sm"
          >
            {isCancelPending ? "Membatalkan..." : "Batalkan Langganan"}
          </Button>
        )}
      </Card>

      {/* Pilihan Paket Tersedia */}
      <div>
        <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100 mb-4">
          Pilihan Paket Workspace
        </h3>

        {isPlansLoading ? (
          <div className="py-12 text-center text-sm text-neutral-400">
            Memuat daftar paket...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan: any) => {
              const planTier = (plan.tier || "free") as SubscriptionTier;
              const isCurrent = mySub?.tier === planTier;
              const monthlyPrice = plan.prices?.monthly?.usd ?? plan.priceMonthly ?? 0;

              return (
                <Card
                  key={plan.tier || plan.name}
                  className={`flex flex-col justify-between p-6 ${
                    isCurrent ? "border-blue-600 ring-2 ring-blue-600/20" : ""
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <CardTitle className="text-base">{plan.name}</CardTitle>
                      {planTier === "pro" && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold bg-blue-600 text-white rounded-full">
                          <Sparkles className="w-3 h-3" /> Rekomendasi
                        </span>
                      )}
                    </div>

                    <div className="flex items-baseline gap-1 my-4">
                      <span className="text-3xl font-extrabold text-neutral-900 dark:text-neutral-100">
                        ${monthlyPrice}
                      </span>
                      <span className="text-xs text-neutral-500">/ bulan</span>
                    </div>

                    <CardDescription className="mb-6">
                      {plan.description || "Fitur kolaborasi tim komprehensif."}
                    </CardDescription>

                    <div className="space-y-2.5 text-xs text-neutral-700 dark:text-neutral-300">
                      {(plan.features || [
                        "Unlimited Tasks & Todos",
                        "Calendar & Holiday Sync",
                        "Pomodoro Session Analytics",
                        "Team Collaboration",
                      ]).map((feat: string, idx: number) => (
                        <div key={idx} className="flex items-center gap-2">
                          <Check className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-8 pt-4 border-t border-neutral-100 dark:border-neutral-800">
                    <Button
                      onClick={() => handleCheckout(planTier)}
                      disabled={isCurrent || planTier === "free" || isCheckoutPending}
                      className="w-full"
                      variant={isCurrent || planTier === "free" ? "secondary" : "default"}
                    >
                      {isCurrent
                        ? "Paket Saat Ini"
                        : planTier === "free"
                        ? "Paket Dasar"
                        : isCheckoutPending
                        ? "Mengalihkan..."
                        : "Pilih Paket"}
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
