import { DrawerContentScrollView, DrawerItem, DrawerItemList } from '@react-navigation/drawer';
import { router } from 'expo-router';
import { Drawer } from 'expo-router/drawer';
import {
  Bell,
  Home,
  LayoutDashboard,
  LogOut,
  Music,
  Settings,
  Timer,
  User,
  Users,
} from 'lucide-react-native';
import { Text, TouchableOpacity, View } from 'react-native';

import { WorkspaceSwitcher } from '@/components/section/private/workspace-switcher';
import ThemeToggle from '@/components/ui/toggleTheme';
import PrivateProviders from '@/core/providers/private.provinder';
import { useTheme } from '@/core/providers/theme.provinder';
import { useSwitchWorkspace } from '@/hooks/service/Auth/state/mutate';
import { useWorkspaces } from '@/hooks/service/Auth/state/query';
import { useNotification } from '@/hooks/service/Notification/useNotification';
import { useAppDispatch, useAppSelector } from '@/hooks/toolkit/redux';
import { clearAuthTokens } from '@/service/auth-storage';
import { logout } from '@/stores/authSlice/authSlice';

function HeaderRightActions() {
  const { colors } = useTheme();
  const { query } = useNotification();
  const { data: notifications = [] } = query.list();
  const unreadCount = Array.isArray(notifications)
    ? notifications.filter((n) => !n.readAt).length
    : 0;

  return (
    <View className="flex-row items-center gap-2 mr-3">
      <TouchableOpacity
        onPress={() => router.push('/(private)/notifications/page' as any)}
        className="relative p-1.5"
      >
        <Bell size={20} color={colors.text} />
        {unreadCount > 0 ? (
          <View
            className="absolute top-0 right-0 min-w-4 h-4 rounded-full items-center justify-center px-1"
            style={{ backgroundColor: '#ef4444' }}
          >
            <Text className="text-[9px] font-bold text-white">
              {unreadCount > 9 ? '9+' : unreadCount}
            </Text>
          </View>
        ) : null}
      </TouchableOpacity>
      <ThemeToggle />
    </View>
  );
}

function CustomDrawerContent(props: any) {
  const { colors, isDark } = useTheme();
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector((state) => state.auth.currentUser);
  const displayName =
    (currentUser as any)?.user?.fullName ?? (currentUser as any)?.fullName ?? 'User';
  const displayEmail = (currentUser as any)?.user?.email ?? (currentUser as any)?.email ?? '';
  const roleName =
    (currentUser as any)?.user?.companyRole ?? (currentUser as any)?.companyRole ?? 'Member';
  const activeCompanyId =
    (currentUser as any)?.user?.companyId ?? (currentUser as any)?.companyId ?? null;

  const { data: workspaces, isLoading: isWorkspacesLoading } = useWorkspaces();
  const switchWorkspace = useSwitchWorkspace();

  const handleLogout = async () => {
    dispatch(logout());
    await clearAuthTokens();
    router.replace('/(auth)/login/page');
  };

  const handleSelectWorkspace = (workspaceId: string) => {
    if (switchWorkspace.isPending) return;
    switchWorkspace.mutate({ workspaceId });
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
            <Text className="text-base font-bold" style={{ color: colors.text }}>
              {displayName}
            </Text>
            {displayEmail ? (
              <Text className="text-xs text-gray-500" numberOfLines={1}>
                {displayEmail}
              </Text>
            ) : null}
            <View
              className="px-2 py-0.5 rounded-full mt-1.5 self-start"
              style={{ backgroundColor: colors.primary + '20' }}
            >
              <Text className="text-[10px] font-bold" style={{ color: colors.primary }}>
                {roleName}
              </Text>
            </View>
          </View>
        </View>
      </View>

      <WorkspaceSwitcher
        service={{
          companies: workspaces?.companies ?? [],
          activeType: workspaces?.activeType,
          isLoading: isWorkspacesLoading,
          isPending: switchWorkspace.isPending,
          onSelect: handleSelectWorkspace,
        }}
        state={{ activeCompanyId }}
      />

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
  const { colors, isDark } = useTheme();
  const currentUser = useAppSelector((state) => state.auth.currentUser?.user);
  const isOwner = currentUser?.companyRole?.toLowerCase() === 'owner';

  return (
    <PrivateProviders>
      <Drawer
        drawerContent={(props) => <CustomDrawerContent {...props} />}
        screenOptions={{
          headerStyle: {
            backgroundColor: isDark ? colors.card : colors.background,
          },
          headerTintColor: colors.text,
          headerRight: () => <HeaderRightActions />,
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
            title: 'Workspace',
            drawerIcon: ({ size, color }) => <Home size={size} color={color} />,
          }}
        />
        <Drawer.Screen
          name="pomodoro/page"
          options={{
            title: 'Pomodoro Focus',
            drawerIcon: ({ size, color }) => <Timer size={size} color={color} />,
          }}
        />
        <Drawer.Screen
          name="notifications/page"
          options={{
            title: 'Notifikasi',
            drawerIcon: ({ size, color }) => <Bell size={size} color={color} />,
          }}
        />
        <Drawer.Screen
          name="members/page"
          options={{
            title: 'Anggota Tim',
            drawerIcon: ({ size, color }) => <Users size={size} color={color} />,
            drawerItemStyle: {
              display: isOwner ? 'flex' : 'none',
            },
          }}
        />
        <Drawer.Screen
          name="overview/page"
          options={{
            title: 'Ringkasan',
            drawerIcon: ({ size, color }) => <LayoutDashboard size={size} color={color} />,
            drawerItemStyle: {
              display: isOwner ? 'flex' : 'none',
            },
          }}
        />
        <Drawer.Screen
          name="settings/page"
          options={{
            title: 'Pengaturan & Jam Kerja',
            drawerIcon: ({ size, color }) => <Settings size={size} color={color} />,
          }}
        />
      </Drawer>
    </PrivateProviders>
  );
}
