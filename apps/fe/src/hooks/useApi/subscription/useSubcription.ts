import { useCancelSubscription, useCreateCheckout } from "./state/mutate";
import { useSubscriptionPlans } from "./state/query";

export const useSubscription = () => {
  return {
    mutate: {
      cancel: useCancelSubscription,
      create: useCreateCheckout,
    },
    query: {
      get: useSubscription,
      getPlans: useSubscriptionPlans,
    },
  };
};
