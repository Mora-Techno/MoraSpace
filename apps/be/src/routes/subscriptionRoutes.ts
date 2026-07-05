import Elysia from "elysia";
import SubscriptionController from "@/controllers/SubscriptionController";
import { CreateCheckoutDto } from "@/dto/subscription.dto";
import { AppContext } from "@/contex";

class SubscriptionRouter {
  public subscriptionRouter;

  constructor() {
    this.subscriptionRouter = new Elysia({
      prefix: "/subscriptions",
      tags: ["Subscriptions"],
    });
    this.routes();
  }

  private routes() {
    this.subscriptionRouter.get(
      "/plans",
      (c: AppContext) => SubscriptionController.listPlans(c),
      {
        detail: {
          summary: "Daftar paket langganan",
          description:
            "Free (gratis), Pro ($5/bulan atau yearly), Enterprise. Stripe untuk internasional, Xendit untuk Indonesia.",
          tags: ["Subscriptions"],
        },
      },
    );
    this.subscriptionRouter.post(
      "/webhooks/stripe",
      (c: AppContext) => SubscriptionController.stripeWebhook(c),
      {
        detail: {
          summary: "Webhook Stripe",
          tags: ["Subscriptions"],
        },
      },
    );
    this.subscriptionRouter.post(
      "/webhooks/xendit",
      (c: AppContext) => SubscriptionController.xenditWebhook(c),
      {
        detail: {
          summary: "Webhook Xendit",
          tags: ["Subscriptions"],
        },
      },
    );
    // pembatas
    this.subscriptionRouter.get(
      "/me",
      (c: AppContext) => SubscriptionController.getMine(c),
      {
        detail: {
          summary: "Langganan company saat ini",
          tags: ["Subscriptions"],
        },
      },
    );
    this.subscriptionRouter.post(
      "/checkout",
      (c: AppContext) => SubscriptionController.checkout(c),
      {
        body: CreateCheckoutDto,
        detail: {
          summary: "Buat checkout langganan",
          description:
            "Leader membuat checkout. Provider: stripe (USD) atau xendit (IDR). Tier free langsung aktif tanpa pembayaran.",
          tags: ["Subscriptions"],
        },
      },
    );
    this.subscriptionRouter.post(
      "/cancel",
      (c: AppContext) => SubscriptionController.cancel(c),
      {
        detail: {
          summary: "Batalkan langganan",
          description: "Leader membatalkan langganan dan downgrade ke free.",
          tags: ["Subscriptions"],
        },
      },
    );
  }
}

export default new SubscriptionRouter().subscriptionRouter;
