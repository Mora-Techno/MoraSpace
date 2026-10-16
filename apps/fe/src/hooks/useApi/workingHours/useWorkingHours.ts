import { useRecordAppOpened } from './state/mutate';
import { useMemberStatus, useOwnerMetrics, useUrgentQuota } from './state/query';

export const useWorkingHours = () => {
  return {
    mutate: {
      recordAppOpened: useRecordAppOpened,
    },
    query: {
      memberStatus: useMemberStatus,
      urgentQuota: useUrgentQuota,
      ownerMetrics: useOwnerMetrics,
    },
  };
};

export default useWorkingHours;
