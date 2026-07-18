import { useQuery } from '@tanstack/react-query';

import { queryKey } from '@/configs';
import Api from '@/services/api';

export function useGetSettings() {
  return useQuery({
    queryKey: queryKey.settings.detail(),
    queryFn: async () => {
      const res = await Api.Settings.GetSettings();
      return res.data;
    },
  });
}
