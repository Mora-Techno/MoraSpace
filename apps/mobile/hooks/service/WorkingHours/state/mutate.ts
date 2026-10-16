import { useAppMutation } from '@/hooks/useAppMutation';
import Api from '@/service/props.service';

export function useRecordAppOpened() {
  return useAppMutation<{ recorded: boolean }, void>({
    mutationFn: () => Api.WorkingHours.RecordAppOpened(),
  });
}
