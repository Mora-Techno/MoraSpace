import { buildEndpoint } from "../config/api.config";

const mount = "/subscriptions";

export const SUBSCRIPTION_ENDPOINTS = {
  PLANS: buildEndpoint(mount, "/plans"),
  ME: buildEndpoint(mount, "/me"),
  CHECKOUT: buildEndpoint(mount, "/checkout"),
  CANCEL: buildEndpoint(mount, "/cancel"),
  WEBHOOK_STRIPE: buildEndpoint(mount, "/webhooks/stripe"),
  WEBHOOK_XENDIT: buildEndpoint(mount, "/webhooks/xendit"),
} as const;

export function listSubscriptionEndpoints() {
  return Object.keys(SUBSCRIPTION_ENDPOINTS).map((key) => ({
    name: key,
    path: SUBSCRIPTION_ENDPOINTS[key as keyof typeof SUBSCRIPTION_ENDPOINTS],
  }));
}
