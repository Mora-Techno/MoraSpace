import { useMutation } from '@tanstack/react-query';

import { queryKey } from '@/configs';
import { useAppNameSpace } from '@/hooks/useAppNameSpace';
import Api from '@/services/api';

export function useUpdateSettings() {
  const ns = useAppNameSpace();
  return useMutation({
    mutationFn: (payload: any) => Api.Settings.UpdateSettings(payload),
    onSuccess: (res: any) => {
      ns.alert.toast({ title: res.message, message: res.message, icon: 'success' });
    },
    onSettled: async () => {
      await ns.queryClient.invalidateQueries({ queryKey: queryKey.settingsRoot() });
    },
    onError: (err: any) => {
      ns.alert.toast({ title: err.message, message: err.message, icon: 'error' });
    },
  });
}
