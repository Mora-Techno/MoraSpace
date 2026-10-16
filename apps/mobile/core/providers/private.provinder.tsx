import { router } from 'expo-router';
import { useEffect } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { useDispatch } from 'react-redux';

import { Text } from '@/components/ui/text';
import { useTheme } from '@/core/providers/theme.provinder';
import { useGetMyCompany } from '@/hooks/service/Company/state/query';
import { useAppSelector } from '@/hooks/toolkit/redux';
import { clearAuthTokens } from '@/service/auth-storage';
import Api from '@/service/props.service';
import { logout } from '@/stores/authSlice/authSlice';

let hasRecordedMobileAppOpened = false;

export default function PrivateProviders({ children }: { children: React.ReactNode }) {
  const currentUser = useAppSelector((state) => state.auth.currentUser?.user.token);
  const companyId =
    useAppSelector(
      (state: any) => state.auth.currentUser?.user?.companyId ?? state.auth.currentUser?.companyId,
    ) ?? null;
  const isAuth = currentUser;
  const dispatch = useDispatch();
  const { colors } = useTheme();
  const { data: company } = useGetMyCompany({ enabled: !!companyId });

  useEffect(() => {
    if (!isAuth) {
      // Redirect to login if not authenticated
      router.replace('/(auth)/login/page' as any);
    } else if (!hasRecordedMobileAppOpened) {
      hasRecordedMobileAppOpened = true;
      void Api.WorkingHours.RecordAppOpened().catch(() => {});
    }
  }, [isAuth]);

  const handleLogout = async () => {
    dispatch(logout());
    await clearAuthTokens();
    router.replace('/(auth)/login/page');
  };

  if (isAuth && company?.status === 'suspended') {
    return (
      <View
        className="flex-1 items-center justify-center px-8"
        style={{ backgroundColor: colors.background }}
      >
        <Text className="text-xl font-bold text-center" style={{ color: colors.text }}>
          Workspace Dinonaktifkan
        </Text>
        <Text className="mt-2 text-sm text-center" style={{ color: colors.textSecondary }}>
          Company ini dinonaktifkan oleh administrator. Hubungi administrator untuk mengaktifkan
          kembali.
        </Text>
        <TouchableOpacity
          onPress={handleLogout}
          className="mt-6 px-6 py-3 rounded-xl active:opacity-80"
          style={{ backgroundColor: colors.primary }}
        >
          <Text className="text-sm font-semibold" style={{ color: colors.primaryForeground }}>
            Keluar
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return <>{children}</>;
}
