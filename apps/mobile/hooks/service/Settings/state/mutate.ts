import type { Settings, PickUpdateSettings, TResponse } from '@repo/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Alert } from 'react-native';

import { queryKey } from '@/config/query-key';
import Api from '@/service/props.service';

import { readSettingsSnapshot,SettingsCacheContext } from './utils';

export function useUpdateSettings() {
  const queryClient = useQueryClient();
  return useMutation<TResponse<Settings>, Error, PickUpdateSettings, SettingsCacheContext>({
    mutationFn: (payload) => Api.Settings.UpdateSettings(payload),
    onSuccess: (res) => {
      Alert.alert('Sukses', res.message);
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: queryKey.settingsRoot() });
      return { previousData: readSettingsSnapshot(queryClient) };
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKey.settingsRoot() });
    },
    onError: (err) => {
      Alert.alert('Error', err.message);
    },
  });
}
