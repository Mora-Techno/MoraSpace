import { useOwnerOverview } from './state/query';

export const useDashboard = () => {
  return {
    query: {
      ownerOverview: useOwnerOverview,
    },
  };
};
