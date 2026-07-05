import prisma from 'prisma/client';
import type { Prisma } from '@prisma/client';
import StripeService from '@/service/StripeService';
import XenditService from '@/service/XenditService';
import { SUBSCRIPTION_PLANS, getPeriodEnd, getPlanPrice } from '@/config/subscriptionPlans';
import { getWorkstationUserLimit } from '@/utils/tierLimits';
import type { BillingCycle, SubscriptionTier } from '@repo/types/company.types';
import type {
  CheckoutData,
  PaymentProvider,
  PickCreateCheckout,
  SubscriptionDetail,
  SubscriptionStatus,
} from '@repo/types/subscription.types';
import {
  ensurePlan,
  getCompanyTier,
  inferBillingCycle,
  mapPlanNameToTier,
} from '@/utils/planHelper';

class SubscriptionService {
  public listPlans() {
    return SUBSCRIPTION_PLANS;
  }

  public async getDetail(companyId: string): Promise<SubscriptionDetail | null> {
    const company = await prisma.company.findUnique({
      where: { id: companyId },
      include: {
        currentSubscription: { include: { plan: true } },
        subscriptions: {
          include: {
            plan: true,
            invoices: {
              include: { payments: true },
              orderBy: { dueDate: 'desc' },
              take: 10,
            },
          },
          orderBy: { currentPeriodEnd: 'desc' },
        },
      },
    });

    if (!company) return null;

    const tier = await getCompanyTier(companyId);
    const billingCycle = inferBillingCycle(company.currentSubscription);
    const activeSubscription = company.currentSubscription ?? company.subscriptions[0] ?? null;

    const recentPayments = company.subscriptions
      .flatMap((subscription) =>
        subscription.invoices.flatMap((invoice) =>
          invoice.payments.map((payment) => ({
            payment,
            invoice,
            subscription,
          })),
        ),
      )
      .sort((a, b) => {
        const aTime = a.payment.paidAt?.getTime() ?? 0;
        const bTime = b.payment.paidAt?.getTime() ?? 0;
        return bTime - aTime;
      })
      .slice(0, 10);

    return {
      company: {
        id: company.id,
        name: company.name,
        tier,
        billingCycle,
        subscriptionStartsAt:
          activeSubscription?.currentPeriodStart?.toISOString() ?? company.createdAt.toISOString(),
        subscriptionEndsAt: activeSubscription?.currentPeriodEnd?.toISOString() ?? null,
        maxWorkstationUsers: getWorkstationUserLimit(tier),
      },
      subscription: activeSubscription
        ? {
            id: activeSubscription.id,
            companyId: activeSubscription.companyId,
            tier: mapPlanNameToTier(activeSubscription.plan.name),
            billingCycle: inferBillingCycle(activeSubscription),
            status: activeSubscription.status as SubscriptionStatus,
            provider: (activeSubscription.provider as PaymentProvider | null) ?? null,
            currentPeriodStart: activeSubscription.currentPeriodStart?.toISOString() ?? null,
            currentPeriodEnd: activeSubscription.currentPeriodEnd?.toISOString() ?? null,
            cancelAtPeriodEnd: activeSubscription.status === 'canceled',
            maxWorkstationUsers: getWorkstationUserLimit(
              mapPlanNameToTier(activeSubscription.plan.name),
            ),
          }
        : null,
      recentPayments: recentPayments.map(({ payment, subscription }) => ({
        id: payment.id,
        provider: payment.provider as PaymentProvider,
        amount: Number(payment.amount),
        currency: 'usd',
        status: payment.status as 'pending' | 'paid' | 'failed' | 'canceled',
        tier: mapPlanNameToTier(subscription.plan.name),
        billingCycle: inferBillingCycle(subscription),
        createdAt: payment.paidAt?.toISOString() ?? new Date().toISOString(),
      })),
    };
  }

  private async activateSubscription(input: {
    companyId: string;
    tier: SubscriptionTier;
    billingCycle: BillingCycle;
    provider: PaymentProvider;
    providerCustomerId?: string | null;
    providerSubscriptionId?: string | null;
    providerPaymentId?: string | null;
    amount: number;
    currency: string;
    metadata?: Record<string, unknown>;
  }) {
    const now = new Date();
    const periodEnd = getPeriodEnd(input.billingCycle, now);

    return prisma.$transaction(async (tx) => {
      const plan = await ensurePlan(input.tier, tx);

      const existing = await tx.subscription.findFirst({
        where: { companyId: input.companyId },
        orderBy: { currentPeriodEnd: 'desc' },
      });

      const subscription = existing
        ? await tx.subscription.update({
            where: { id: existing.id },
            data: {
              planId: plan.id,
              status: 'active',
              provider: input.provider,
              providerSubscriptionId: input.providerSubscriptionId ?? null,
              currentPeriodStart: now,
              currentPeriodEnd: periodEnd,
            },
          })
        : await tx.subscription.create({
            data: {
              companyId: input.companyId,
              planId: plan.id,
              status: 'active',
              provider: input.provider,
              providerSubscriptionId: input.providerSubscriptionId ?? null,
              currentPeriodStart: now,
              currentPeriodEnd: periodEnd,
            },
          });

      await tx.company.update({
        where: { id: input.companyId },
        data: { subscriptionId: subscription.id },
      });

      const invoice = await tx.invoice.create({
        data: {
          subscriptionId: subscription.id,
          invoiceNumber: `INV-${Date.now()}`,
          amount: input.amount,
          currency: input.currency,
          dueDate: now,
          paidAt: input.amount === 0 ? now : now,
        },
      });

      const payment = await tx.payment.create({
        data: {
          invoiceId: invoice.id,
          provider: input.provider,
          transactionId: input.providerPaymentId ?? null,
          amount: input.amount,
          status: 'paid',
          paidAt: now,
        },
      });

      return { subscription, payment };
    });
  }

  private async createPendingPayment(input: {
    companyId: string;
    tier: SubscriptionTier;
    billingCycle: BillingCycle;
    provider: PaymentProvider;
    providerPaymentId: string;
    amount: number;
    currency: string;
    metadata?: Prisma.InputJsonValue;
  }) {
    const plan = await ensurePlan(input.tier);
    const now = new Date();

    const subscription = await prisma.subscription.findFirst({
      where: { companyId: input.companyId },
      orderBy: { currentPeriodEnd: 'desc' },
    });

    const activeSubscription =
      subscription ??
      (await prisma.subscription.create({
        data: {
          companyId: input.companyId,
          planId: plan.id,
          status: 'incomplete',
        },
      }));

    const invoice = await prisma.invoice.create({
      data: {
        subscriptionId: activeSubscription.id,
        invoiceNumber: `INV-${Date.now()}`,
        amount: input.amount,
        currency: input.currency,
        dueDate: now,
      },
    });

    return prisma.payment.create({
      data: {
        invoiceId: invoice.id,
        provider: input.provider,
        transactionId: input.providerPaymentId,
        amount: input.amount,
        status: 'pending',
      },
    });
  }

  public async createCheckout(
    companyId: string,
    leader: { email: string; fullName: string },
    input: PickCreateCheckout,
  ): Promise<CheckoutData> {
    if (input.tier === 'free') {
      const { amount, currency } = getPlanPrice('free', input.billingCycle, input.provider);

      await this.activateSubscription({
        companyId,
        tier: 'free',
        billingCycle: input.billingCycle,
        provider: input.provider,
        amount,
        currency,
      });

      return {
        provider: input.provider,
        checkoutUrl: null,
        sessionId: 'free-tier',
        tier: input.tier,
        billingCycle: input.billingCycle,
        amount,
        currency,
      };
    }

    const frontendUrl = process.env.FRONTEND_URL ?? 'http://localhost:3000';
    const successUrl = `${frontendUrl}/subscription/success?provider=${input.provider}`;
    const cancelUrl = `${frontendUrl}/subscription/cancel?provider=${input.provider}`;

    if (input.provider === 'stripe') {
      if (!StripeService.isConfigured()) {
        throw new Error('Stripe belum dikonfigurasi. Isi STRIPE_SECRET_KEY di .env');
      }

      const session = await StripeService.createCheckoutSession({
        companyId,
        email: leader.email,
        tier: input.tier,
        billingCycle: input.billingCycle,
        successUrl,
        cancelUrl,
      });

      await this.createPendingPayment({
        companyId,
        tier: input.tier,
        billingCycle: input.billingCycle,
        provider: 'stripe',
        providerPaymentId: session.sessionId,
        amount: session.amount,
        currency: session.currency,
      });

      return {
        provider: 'stripe',
        checkoutUrl: session.checkoutUrl,
        sessionId: session.sessionId,
        tier: input.tier,
        billingCycle: input.billingCycle,
        amount: session.amount,
        currency: session.currency,
      };
    }

    if (!XenditService.isConfigured()) {
      throw new Error('Xendit belum dikonfigurasi. Isi XENDIT_SECRET_KEY di .env');
    }

    const invoice = await XenditService.createInvoice({
      companyId,
      email: leader.email,
      fullName: leader.fullName,
      tier: input.tier,
      billingCycle: input.billingCycle,
      successUrl,
      cancelUrl,
    });

    await this.createPendingPayment({
      companyId,
      tier: input.tier,
      billingCycle: input.billingCycle,
      provider: 'xendit',
      providerPaymentId: invoice.sessionId,
      amount: invoice.amount,
      currency: invoice.currency,
      metadata: { externalId: invoice.externalId },
    });

    return {
      provider: 'xendit',
      checkoutUrl: invoice.checkoutUrl,
      sessionId: invoice.sessionId,
      tier: input.tier,
      billingCycle: input.billingCycle,
      amount: invoice.amount,
      currency: invoice.currency,
    };
  }

  public async cancelSubscription(companyId: string) {
    const subscription = await prisma.subscription.findFirst({
      where: { companyId, status: 'active' },
      orderBy: { currentPeriodEnd: 'desc' },
    });

    if (!subscription) {
      throw new Error('Langganan aktif tidak ditemukan');
    }

    return prisma.subscription.update({
      where: { id: subscription.id },
      data: { status: 'canceled' },
    });
  }

  public async handleStripeWebhook(payload: string, signature: string | null) {
    const event = StripeService.constructWebhookEvent(payload, signature);

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as {
        id: string;
        metadata?: Record<string, string>;
        customer?: string | null;
        subscription?: string | null;
        amount_total?: number | null;
        currency?: string | null;
      };

      const companyId = session.metadata?.companyId;
      const tier = session.metadata?.tier as SubscriptionTier | undefined;
      const billingCycle = session.metadata?.billingCycle as BillingCycle | undefined;

      if (!companyId || !tier || !billingCycle) {
        throw new Error('Metadata checkout Stripe tidak lengkap');
      }

      await prisma.payment.updateMany({
        where: {
          transactionId: session.id,
          provider: 'stripe',
        },
        data: { status: 'paid', paidAt: new Date() },
      });

      await this.activateSubscription({
        companyId,
        tier,
        billingCycle,
        provider: 'stripe',
        providerSubscriptionId: session.subscription ?? null,
        providerPaymentId: session.id,
        amount: session.amount_total ?? 0,
        currency: session.currency ?? 'usd',
        metadata: session.metadata,
      });
    }

    return { received: true, type: event.type };
  }

  public async handleXenditWebhook(payload: Record<string, unknown>, callbackToken: string | null) {
    if (!XenditService.verifyWebhookToken(callbackToken)) {
      throw new Error('Xendit webhook token tidak valid');
    }

    const status = String(payload.status ?? '');
    const metadata = (payload.metadata ?? {}) as Record<string, string>;
    const companyId = metadata.companyId;
    const tier = metadata.tier as SubscriptionTier | undefined;
    const billingCycle = metadata.billingCycle as BillingCycle | undefined;
    const invoiceId = String(payload.id ?? '');

    if (status.toUpperCase() === 'PAID' && companyId && tier && billingCycle) {
      await prisma.payment.updateMany({
        where: {
          transactionId: invoiceId,
          provider: 'xendit',
        },
        data: { status: 'paid', paidAt: new Date() },
      });

      await this.activateSubscription({
        companyId,
        tier,
        billingCycle,
        provider: 'xendit',
        providerPaymentId: invoiceId,
        amount: Number(payload.amount ?? 0),
        currency: String(payload.currency ?? 'idr').toLowerCase(),
        metadata: payload,
      });
    }

    return { received: true, status };
  }
}

export default new SubscriptionService();
