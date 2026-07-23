import { useCancelSubscription, useCreateCheckout } from './state/mutate';
import { useSubscription as useGetMySubscription, useSubscriptionPlans } from './state/query';

export const useSubscription = () => {
  return {
    mutate: {
      cancel: useCancelSubscription,
      create: useCreateCheckout,
    },
    query: {
      get: useGetMySubscription,
      getPlans: useSubscriptionPlans,
    },
  };
};
