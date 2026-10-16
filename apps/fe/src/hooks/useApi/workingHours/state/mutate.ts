import { useAppMutation } from '@/hooks/useAppMutation';
import Api from '@/services/api';

export function useRecordAppOpened() {
  return useAppMutation<{ recorded: boolean }, void>({
    mutationFn: () => Api.WorkingHours.RecordAppOpened(),
  });
}
