import { SUBSCRIPTION_ENDPOINTS } from "../endpoints/subscription.endpoints";
import type { TResponse } from "../types/response.types";
import type {
  CheckoutData,
  PickCreateCheckout,
  SubscriptionDetail,
  SubscriptionPlan,
  SubscriptionQuery,
} from "../types/subscription.types";
import { GetResponse, PostResponse, withQuery } from "./http";
import { toServiceResponse } from "./service-response";

class SubscriptionService {
  public async ListPlans(): Promise<TResponse<SubscriptionPlan[]>> {
    const res = await GetResponse<SubscriptionPlan[]>(
      SUBSCRIPTION_ENDPOINTS.PLANS,
    );
    return toServiceResponse(res, {
      message: "Daftar paket berhasil diambil",
    });
  }
  public async GetMySubscription(): Promise<TResponse<SubscriptionDetail>> {
    const res = await GetResponse<SubscriptionDetail>(
      SUBSCRIPTION_ENDPOINTS.ME,
    );
    return toServiceResponse(res, {
      message: "Langganan berhasil diambil",
    });
  }
  public async Checkout(
    payload: PickCreateCheckout,
  ): Promise<TResponse<CheckoutData>> {
    const res = await PostResponse<CheckoutData>(
      SUBSCRIPTION_ENDPOINTS.CHECKOUT,
      payload,
    );
    return toServiceResponse(res, {
      message: "Checkout berhasil dibuat",
      statusCode: 201,
    });
  }
  public async CancelSubscription(): Promise<TResponse<{ id: string }>> {
    const res = await PostResponse<{ id: string }>(
      SUBSCRIPTION_ENDPOINTS.CANCEL,
    );
    return toServiceResponse(res, {
      message: "Langganan berhasil dibatalkan",
    });
  }

  public async ListSubscriptions(
    query?: SubscriptionQuery,
  ): Promise<TResponse<SubscriptionDetail[]>> {
    const res = await GetResponse<SubscriptionDetail[]>(
      withQuery(SUBSCRIPTION_ENDPOINTS.LIST, query),
    );
    return toServiceResponse(res, {
      message: "Daftar langganan berhasil diambil",
    });
  }
}
export default new SubscriptionService();
