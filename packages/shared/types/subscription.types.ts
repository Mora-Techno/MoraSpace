import type { BillingCycle, ICompany, SubscriptionTier } from "./company.types";

export type SubscriptionQuery = {
  search?: string;
  page?: number;
  limit?: number;
  status?: string;
  planId?: string;
  startDate?: string;
  endDate?: string;
};

export type PaymentProvider = "stripe" | "xendit";
export type PaymentStatus = "pending" | "paid" | "failed" | "canceled";
export type SubscriptionStatus =
  | "active"
  | "canceled"
  | "past_due"
  | "incomplete";

export interface ISubscription {
  id: string;
  companyId: string;
  tier: SubscriptionTier;
  billingCycle: BillingCycle;
  status: SubscriptionStatus;
  provider: PaymentProvider | null;
  providerCustomerId: string | null;
  providerSubscriptionId: string | null;
  currentPeriodStart: Date | null;
  currentPeriodEnd: Date | null;
  cancelAtPeriodEnd: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IPayment {
  id: string;
  companyId: string;
  subscriptionId: string | null;
  provider: PaymentProvider;
  providerPaymentId: string | null;
  amount: number;
  currency: string;
  status: PaymentStatus;
  tier: SubscriptionTier;
  billingCycle: BillingCycle;
  metadata: Record<string, unknown> | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface PlanPrice {
  usd: number;
  idr: number;
}

export interface SubscriptionPlan {
  tier: SubscriptionTier;
  name: string;
  description: string;
  maxWorkstationUsers: number;
  prices: {
    monthly: PlanPrice;
    yearly: PlanPrice;
  };
  features: string[];
}

export type PickCreateCheckout = Pick<
  ISubscription,
  "tier" | "billingCycle"
> & {
  provider: PaymentProvider;
};

export interface CheckoutData extends Pick<
  IPayment,
  "provider" | "tier" | "billingCycle" | "amount" | "currency"
> {
  checkoutUrl: string | null;
  sessionId: string;
}

export interface SubscriptionInfo extends Pick<
  ISubscription,
  | "id"
  | "companyId"
  | "tier"
  | "billingCycle"
  | "status"
  | "provider"
  | "cancelAtPeriodEnd"
> {
  currentPeriodStart: string | null;
  currentPeriodEnd: string | null;
  maxWorkstationUsers: number;
}

export interface PaymentInfo extends Pick<
  IPayment,
  "id" | "provider" | "amount" | "currency" | "status" | "tier" | "billingCycle"
> {
  createdAt: string;
}

export interface SubscriptionDetail {
  company: Pick<ICompany, "id" | "name" | "tier" | "billingCycle"> & {
    subscriptionStartsAt: string;
    subscriptionEndsAt: string | null;
    maxWorkstationUsers: number;
  };
  subscription: SubscriptionInfo | null;
  recentPayments: PaymentInfo[];
}
