import Stripe from 'stripe';
import type { BillingCycle, SubscriptionTier } from '@repo/types/company.types';
import { getPlan, getPlanPrice } from '@/config/subscriptionPlans';

class StripeService {
  private getClient(): Stripe {
    const secretKey = process.env.STRIPE_SECRET_KEY;
    if (!secretKey) {
      throw new Error('STRIPE_SECRET_KEY belum dikonfigurasi');
    }

    return new Stripe(secretKey);
  }

  public isConfigured(): boolean {
    return Boolean(process.env.STRIPE_SECRET_KEY);
  }

  public async createCheckoutSession(input: {
    companyId: string;
    email: string;
    tier: SubscriptionTier;
    billingCycle: BillingCycle;
    successUrl: string;
    cancelUrl: string;
  }) {
    const stripe = this.getClient();
    const plan = getPlan(input.tier);
    const { amount, currency } = getPlanPrice(input.tier, input.billingCycle, 'stripe');

    const interval = input.billingCycle === 'yearly' ? 'year' : 'month';

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      customer_email: input.email,
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency,
            unit_amount: amount,
            recurring: { interval },
            product_data: {
              name: `Mora ${plan.name} (${input.billingCycle})`,
              description: plan.description,
            },
          },
        },
      ],
      success_url: input.successUrl,
      cancel_url: input.cancelUrl,
      metadata: {
        companyId: input.companyId,
        tier: input.tier,
        billingCycle: input.billingCycle,
        provider: 'stripe',
      },
      subscription_data: {
        metadata: {
          companyId: input.companyId,
          tier: input.tier,
          billingCycle: input.billingCycle,
        },
      },
    });

    return {
      checkoutUrl: session.url,
      sessionId: session.id,
      amount,
      currency,
    };
  }

  public async constructWebhookEvent(payload: string, signature: string | null) {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!webhookSecret) {
      throw new Error('STRIPE_WEBHOOK_SECRET belum dikonfigurasi');
    }

    if (!signature) {
      throw new Error('Stripe signature header tidak ditemukan');
    }

    const stripe = this.getClient();
    return stripe.webhooks.constructEventAsync(payload, signature, webhookSecret);
  }
}

export default new StripeService();
