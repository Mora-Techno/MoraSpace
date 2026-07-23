import { useQuery } from '@tanstack/react-query';

import { queryKey } from '@/config/query-key';
import Api from '@/service/props.service';

export function useGetSettings() {
  return useQuery({
    queryKey: queryKey.settings.detail(),
    queryFn: async () => {
      const res = await Api.Settings.GetSettings();
      return res.data;
    },
  });
}
