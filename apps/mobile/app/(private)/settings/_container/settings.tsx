import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Briefcase, Building2, Clock, LogOut, Moon, Shield, Sun, User } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useTheme } from '@/core/providers/theme.provinder';
import { useCompany } from '@/hooks/service/Company/useCompany';
import { useAppDispatch, useAppSelector } from '@/hooks/toolkit/redux';
import { clearAuthTokens } from '@/service/auth-storage';
import { logout } from '@/stores/authSlice/authSlice';

export function MobileSettingsContainer() {
  const { colors, isDark, toggleTheme } = useTheme();
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
    <SafeAreaView edges={['top', 'bottom']} style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, padding: 20 }}
        style={{ backgroundColor: colors.background }}
      >
        <View className="mb-6">
          <Text className="text-2xl font-bold" style={{ color: colors.text }}>
            Pengaturan & Profil
          </Text>
          <Text className="text-xs text-gray-500 mt-0.5">
            Kelola profil akun dan preferensi ruang kerja
          </Text>
        </View>

        {/* Profile Card */}
        <View
          className="p-5 rounded-2xl border mb-5"
          style={{
            backgroundColor: colors.card,
            borderColor: colors.border,
          }}
        >
          <View className="flex-row items-center">
            <View
              className="w-14 h-14 rounded-full items-center justify-center"
              style={{ backgroundColor: colors.primary + '20' }}
            >
              <User size={28} color={colors.primary} />
            </View>
            <View className="ml-4 flex-1">
              <Text className="text-base font-bold" style={{ color: colors.text }}>
                {currentUser?.fullName ?? 'User'}
              </Text>
              <Text className="text-xs text-gray-500 mt-0.5">{currentUser?.email ?? ''}</Text>

              <View className="flex-row items-center gap-1.5 mt-2">
                <Shield size={12} color={colors.primary} />
                <View
                  className="px-2 py-0.5 rounded-full"
                  style={{ backgroundColor: colors.primary + '15' }}
                >
                  <Text className="text-[10px] font-bold" style={{ color: colors.primary }}>
                    {currentUser?.companyRole ?? 'Member'}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Appearance & Preferences */}
        <View
          className="p-5 rounded-2xl border mb-5"
          style={{
            backgroundColor: colors.card,
            borderColor: colors.border,
          }}
        >
          <Text className="text-sm font-bold mb-3" style={{ color: colors.text }}>
            Tampilan & Tema
          </Text>

          <View className="flex-row items-center justify-between py-2">
            <View className="flex-row items-center">
              {isDark ? <Moon size={18} color="#a855f7" /> : <Sun size={18} color="#eab308" />}
              <Text className="text-sm ml-3 font-medium" style={{ color: colors.text }}>
                Mode Gelap ({isDark ? 'Aktif' : 'Nonaktif'})
              </Text>
            </View>
            <Switch
              value={isDark}
              onValueChange={toggleTheme}
              trackColor={{ false: '#d1d5db', true: colors.primary }}
              thumbColor="#ffffff"
            />
          </View>
        </View>

        {/* Working Hours Section (Spaces v0.0.1 Principle) */}
        <View
          className="p-5 rounded-2xl border mb-5"
          style={{
            backgroundColor: colors.card,
            borderColor: colors.border,
          }}
        >
          <View className="flex-row items-center justify-between mb-2">
            <View className="flex-row items-center">
              <Clock size={18} color={colors.primary} />
              <Text className="text-sm font-bold ml-2" style={{ color: colors.text }}>
                Jam Kerja Perusahaan
              </Text>
            </View>
            {isOwner ? (
              <View className="px-2 py-0.5 rounded-md bg-warning/20">
                <Text className="text-[10px] font-semibold text-foreground">Edit Akses: Owner</Text>
              </View>
            ) : (
              <View className="px-2 py-0.5 rounded-md bg-gray-500/20">
                <Text className="text-[10px] text-gray-400">Read-Only</Text>
              </View>
            )}
          </View>

          <Text className="text-xs text-gray-500 mb-4">
            {isOwner
              ? 'Atur jam operasional resmi untuk kebijakan pengiriman notifikasi kerja.'
              : 'Jadwal jam kerja resmi yang dikonfigurasi oleh pemilik perusahaan.'}
          </Text>

          {isSettingsLoading ? (
            <ActivityIndicator size="small" color={colors.primary} />
          ) : isOwner ? (
            /* Owner Edit Form */
            <View className="gap-3">
              <View className="flex-row gap-3">
                <View className="flex-1">
                  <Text className="text-xs text-gray-400 mb-1">Jam Mulai</Text>
                  <TextInput
                    value={startTime}
                    onChangeText={setStartTime}
                    placeholder="09:00"
                    placeholderTextColor={colors.textSecondary}
                    className="p-3 border rounded-xl text-sm"
                    style={{ color: colors.text, borderColor: colors.border }}
                  />
                </View>
                <View className="flex-1">
                  <Text className="text-xs text-gray-400 mb-1">Jam Pulang</Text>
                  <TextInput
                    value={endTime}
                    onChangeText={setEndTime}
                    placeholder="17:00"
                    placeholderTextColor={colors.textSecondary}
                    className="p-3 border rounded-xl text-sm"
                    style={{ color: colors.text, borderColor: colors.border }}
                  />
                </View>
              </View>

              <View>
                <Text className="text-xs text-gray-400 mb-1">Hari Kerja</Text>
                <TextInput
                  value={workDays}
                  onChangeText={setWorkDays}
                  placeholder="Senin - Jumat"
                  placeholderTextColor={colors.textSecondary}
                  className="p-3 border rounded-xl text-sm"
                  style={{ color: colors.text, borderColor: colors.border }}
                />
              </View>

              <View className="flex-row items-center justify-between py-2 mt-1">
                <View className="flex-1 mr-3">
                  <Text className="text-xs font-semibold" style={{ color: colors.text }}>
                    Respect Working Hours Policy
                  </Text>
                  <Text className="text-[11px] text-gray-500">
                    Tunda notifikasi non-kritis di luar jam kerja
                  </Text>
                </View>
                <Switch
                  value={respectWorkingHours}
                  onValueChange={setRespectWorkingHours}
                  trackColor={{ false: '#d1d5db', true: colors.primary }}
                  thumbColor="#ffffff"
                />
              </View>

              <TouchableOpacity
                onPress={handleSaveWorkingHours}
                disabled={updateCompanySettings.isPending}
                className="mt-2 py-3 rounded-xl items-center"
                style={{ backgroundColor: colors.primary }}
              >
                <Text className="text-primary-foreground text-xs font-bold">
                  {updateCompanySettings.isPending ? 'Menyimpan...' : 'Simpan Pengaturan Jam Kerja'}
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            /* Member Read-Only View */
            <View className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800/40 border border-gray-200 dark:border-gray-700">
              <View className="flex-row items-center justify-between mb-1.5">
                <Text className="text-xs text-gray-400">Jam Operasional:</Text>
                <Text className="text-xs font-bold" style={{ color: colors.text }}>
                  {startTime} - {endTime}
                </Text>
              </View>
              <View className="flex-row items-center justify-between">
                <Text className="text-xs text-gray-400">Hari Kerja:</Text>
                <Text className="text-xs font-bold" style={{ color: colors.text }}>
                  {workDays}
                </Text>
              </View>
            </View>
          )}
        </View>

        {/* Logout Button */}
        <TouchableOpacity
          onPress={handleLogout}
          className="flex-row items-center justify-center p-4 rounded-2xl border mb-6"
          style={{ borderColor: colors.destructive + '40', backgroundColor: colors.card }}
        >
          <LogOut size={18} color={colors.destructive} />
          <Text className="text-sm font-bold ml-2" style={{ color: colors.destructive }}>
            Keluar dari Akun
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
