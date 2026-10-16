import type { NotificationInApp } from '@repo/types/notification.types';
import { StatusBar } from 'expo-status-bar';
import { Bell, CheckCheck, Clock, Info } from 'lucide-react-native';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useTheme } from '@/core/providers/theme.provinder';

interface NotificationsSectionProps {
  service: {
    notifications: NotificationInApp[];
    totalCount: number;
    unreadCount: number;
    isLoading: boolean;
    isError: boolean;
    isFetching: boolean;
    markAllPending: boolean;
    onMarkRead: (id: string) => void;
    onMarkAllRead: () => void;
    onRetry: () => void;
  };
  state: {
    filterMode: 'all' | 'unread';
    setFilterMode: (v: 'all' | 'unread') => void;
  };
}

export function NotificationsSection({ service, state }: NotificationsSectionProps) {
  const { colors, isDark } = useTheme();
  const {
    notifications,
    totalCount,
    unreadCount,
    isLoading,
    isError,
    isFetching,
    markAllPending,
    onMarkRead,
    onMarkAllRead,
    onRetry,
  } = service;
  const { filterMode, setFilterMode } = state;

  return (
    <SafeAreaView edges={['top', 'bottom']} style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <View className="flex-1 p-4" style={{ backgroundColor: colors.background }}>
        {/* Header */}
        <View className="flex-row items-center justify-between mb-4">
          <View>
            <Text className="text-xl font-bold" style={{ color: colors.text }}>
              Pusat Notifikasi
            </Text>
            <Text className="text-xs text-gray-500">
              {unreadCount > 0
                ? `${unreadCount} notifikasi belum dibaca`
                : 'Semua notifikasi telah dibaca'}
            </Text>
          </View>

          {unreadCount > 0 ? (
            <TouchableOpacity
              onPress={onMarkAllRead}
              disabled={markAllPending}
              className="flex-row items-center px-3 py-1.5 rounded-lg border"
              style={{ borderColor: colors.border }}
            >
              <CheckCheck size={14} color={colors.primary} />
              <Text className="text-xs font-semibold ml-1.5" style={{ color: colors.primary }}>
                Tandai Semua
              </Text>
            </TouchableOpacity>
          ) : null}
        </View>

        {/* Filter Switcher */}
        <View className="flex-row gap-2 mb-4">
          <TouchableOpacity
            onPress={() => setFilterMode('all')}
            className="px-4 py-1.5 rounded-xl border"
            style={{
              backgroundColor: filterMode === 'all' ? colors.primary : colors.card,
              borderColor: filterMode === 'all' ? colors.primary : colors.border,
            }}
          >
            <Text
              className="text-xs font-semibold"
              style={{ color: filterMode === 'all' ? colors.primaryForeground : colors.text }}
            >
              Semua ({totalCount})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setFilterMode('unread')}
            className="px-4 py-1.5 rounded-xl border"
            style={{
              backgroundColor: filterMode === 'unread' ? colors.primary : colors.card,
              borderColor: filterMode === 'unread' ? colors.primary : colors.border,
            }}
          >
            <Text
              className="text-xs font-semibold"
              style={{ color: filterMode === 'unread' ? colors.primaryForeground : colors.text }}
            >
              Belum Dibaca ({unreadCount})
            </Text>
          </TouchableOpacity>
        </View>

        {/* List Content */}
        {isLoading ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="small" color={colors.primary} />
          </View>
        ) : isError ? (
          <View className="flex-1 items-center justify-center gap-2">
            <Text className="text-sm" style={{ color: colors.text }}>
              Gagal memuat notifikasi.
            </Text>
            <TouchableOpacity
              onPress={onRetry}
              className="px-4 py-2 rounded-lg"
              style={{ backgroundColor: colors.primary }}
            >
              <Text className="text-primary-foreground text-xs font-semibold">Coba lagi</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={notifications}
            keyExtractor={(item) => item.id}
            refreshControl={
              <RefreshControl
                refreshing={isFetching && !isLoading}
                onRefresh={onRetry}
                tintColor={colors.primary}
              />
            }
            renderItem={({ item }: { item: NotificationInApp }) => {
              const isUnread = !item.readAt;
              return (
                <TouchableOpacity
                  onPress={() => {
                    if (isUnread) onMarkRead(item.id);
                  }}
                  activeOpacity={0.7}
                  className="p-4 mb-3 rounded-2xl border"
                  style={{
                    backgroundColor: isUnread ? (isDark ? '#1e293b' : '#f0fdf4') : colors.card,
                    borderColor: isUnread ? colors.primary + '50' : colors.border,
                  }}
                >
                  <View className="flex-row items-start justify-between">
                    <View className="flex-row items-start flex-1 mr-2">
                      <View
                        className="w-8 h-8 rounded-full items-center justify-center mt-0.5"
                        style={{
                          backgroundColor: isUnread ? colors.primary + '20' : colors.border,
                        }}
                      >
                        <Bell size={16} color={isUnread ? colors.primary : colors.textSecondary} />
                      </View>
                      <View className="ml-3 flex-1">
                        <Text
                          className={`text-sm ${isUnread ? 'font-bold' : 'font-medium'}`}
                          style={{ color: colors.text }}
                        >
                          {item.title}
                        </Text>
                        <Text className="text-xs text-gray-500 mt-1 leading-relaxed">
                          {item.body}
                        </Text>
                        <View className="flex-row items-center gap-1 mt-2">
                          <Clock size={11} color={colors.textSecondary} />
                          <Text className="text-[10px] text-gray-400">
                            {new Date(item.createdAt).toLocaleString()}
                          </Text>
                        </View>
                      </View>
                    </View>

                    {isUnread ? (
                      <View
                        className="w-2.5 h-2.5 rounded-full mt-1.5"
                        style={{ backgroundColor: colors.primary }}
                      />
                    ) : null}
                  </View>
                </TouchableOpacity>
              );
            }}
            ListEmptyComponent={
              <View className="items-center justify-center py-20">
                <Info size={28} color={colors.textSecondary} />
                <Text className="text-xs text-gray-400 mt-2">Tidak ada notifikasi.</Text>
              </View>
            }
          />
        )}
      </View>
    </SafeAreaView>
  );
}
