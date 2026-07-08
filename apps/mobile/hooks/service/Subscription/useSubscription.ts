import { useCancelSubscription, useCreateCheckout } from './state/mutate';
import { useSubscription, useSubscriptionPlans } from './state/query';

export const useSubscriptions = () => {
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
