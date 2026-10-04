import { DrawerContentScrollView, DrawerItem, DrawerItemList } from '@react-navigation/drawer';
import { router } from 'expo-router';
import { Drawer } from 'expo-router/drawer';
import { Home, LogOut, User } from 'lucide-react-native';
import { Text, View } from 'react-native';

import ThemeToggle from '@/components/ui/toggleTheme';
import PrivateProviders from '@/core/providers/private.provinder';
import { useTheme } from '@/core/providers/theme.provinder';
import { useAppDispatch, useAppSelector } from '@/hooks/toolkit/redux';
import { clearAuthTokens } from '@/service/auth-storage';
import { logout } from '@/stores/authSlice/authSlice';

function CustomDrawerContent(props: any) {
  const { theme, colors, isDark } = useTheme();
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector((state) => state.auth.currentUser);
  const displayName =
    (currentUser as any)?.user?.fullName ?? (currentUser as any)?.fullName ?? 'User';
  const displayEmail = (currentUser as any)?.user?.email ?? (currentUser as any)?.email ?? '';

  const handleLogout = async () => {
    dispatch(logout());
    await clearAuthTokens();
    router.replace('/(auth)/login/page');
  };

  return (
    <DrawerContentScrollView
      {...props}
      style={{ backgroundColor: isDark ? colors.card : colors.background }}
    >
      <View className={`p-6 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
        <View className="flex-row items-center mb-2">
          <View
            className={`w-12 h-12 rounded-full items-center justify-center ${
              isDark ? 'bg-gray-700' : 'bg-gray-200'
            }`}
          >
            <User size={24} color={colors.primary} />
          </View>
          <View className="ml-3 flex-1">
            <Text className="text-lg font-bold">{displayName}</Text>
            {displayEmail ? <Text className="text-sm text-gray-500">{displayEmail}</Text> : null}
          </View>
        </View>
      </View>

      <View className="py-2">
        <DrawerItemList {...props} />
      </View>

      <View className={`mt-auto border-t ${isDark ? 'border-gray-700' : 'border-gray-200'} p-4`}>
        <DrawerItem
          label="Logout"
          icon={({ size }) => <LogOut size={size} color={colors.destructive} />}
          labelStyle={{ color: colors.destructive }}
          onPress={handleLogout}
        />
      </View>
    </DrawerContentScrollView>
  );
}

export default function PrivateLayout() {
  const { theme, colors, isDark } = useTheme();

  return (
    <PrivateProviders>
      <Drawer
        drawerContent={(props) => <CustomDrawerContent {...props} />}
        screenOptions={{
          headerStyle: {
            backgroundColor: isDark ? colors.card : colors.background,
          },
          headerTintColor: colors.text,
          headerRight: () => <ThemeToggle />,
          drawerStyle: {
            backgroundColor: isDark ? colors.card : colors.background,
          },
          drawerActiveTintColor: colors.primary,
          drawerInactiveTintColor: colors.textSecondary,
          drawerLabelStyle: {
            marginLeft: -16,
            fontWeight: '600',
          },
        }}
      >
        <Drawer.Screen
          name="(tabs)"
          options={{
            title: 'Home',
            drawerIcon: ({ size, color }) => <Home size={size} color={color} />,
          }}
        />
      </Drawer>
    </PrivateProviders>
  );
}
