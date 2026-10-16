import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert } from 'react-native';

import { SettingsSection } from '@/components/section/private/settings/settings.section';
import { useCompany } from '@/hooks/service/Company/useCompany';
import { useAppDispatch, useAppSelector } from '@/hooks/toolkit/redux';
import { clearAuthTokens } from '@/service/auth-storage';
import { logout } from '@/stores/authSlice/authSlice';

export function MobileSettingsContainer() {
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector((state) => state.auth.currentUser?.user);
  const isOwner = currentUser?.companyRole?.toLowerCase() === 'owner';

  const { query, mutate } = useCompany();
  const { data: companySettings, isLoading: isSettingsLoading } = query.getSettings();
  const updateCompanySettings = mutate.updateSettings();

  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('17:00');
  const [workDays, setWorkDays] = useState('Senin - Jumat');
  const [respectWorkingHours, setRespectWorkingHours] = useState(true);

  useEffect(() => {
    if (companySettings) {
      const s = companySettings as any;
      if (s.workingHourStart) setStartTime(s.workingHourStart);
      if (s.workingHourEnd) setEndTime(s.workingHourEnd);
      if (s.workDays) setWorkDays(s.workDays);
      if (typeof s.respectWorkingHours === 'boolean') {
        setRespectWorkingHours(s.respectWorkingHours);
      }
    }
  }, [companySettings]);

  const handleSaveWorkingHours = () => {
    if (!startTime.trim() || !endTime.trim()) {
      Alert.alert('Validasi', 'Jam mulai dan jam pulang kerja wajib diisi.');
      return;
    }

    updateCompanySettings.mutate(
      {
        workingHourStart: startTime.trim(),
        workingHourEnd: endTime.trim(),
        workDays: workDays.trim(),
        respectWorkingHours,
      },
      {
        onSuccess: () => {
          Alert.alert('Berhasil', 'Pengaturan jam kerja perusahaan berhasil diperbarui.');
        },
        onError: (err: any) => {
          Alert.alert('Gagal', err?.message || 'Gagal menyimpan pengaturan.');
        },
      },
    );
  };

  const handleLogout = async () => {
    Alert.alert('Keluar', 'Apakah Anda yakin ingin keluar dari akun?', [
      { text: 'Batal', style: 'cancel' },
      {
        text: 'Keluar',
        style: 'destructive',
        onPress: async () => {
          dispatch(logout());
          await clearAuthTokens();
          router.replace('/(auth)/login/page');
        },
      },
    ]);
  };

  return (
    <SettingsSection
      service={{
        isOwner,
        currentUser,
        isSettingsLoading,
        savePending: updateCompanySettings.isPending,
        onSave: handleSaveWorkingHours,
        onLogout: handleLogout,
      }}
      state={{
        startTime,
        setStartTime,
        endTime,
        setEndTime,
        workDays,
        setWorkDays,
        respectWorkingHours,
        setRespectWorkingHours,
      }}
    />
  );
}
