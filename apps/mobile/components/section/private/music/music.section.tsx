import type { MusicPlaylist } from '@repo/types';
import { StatusBar } from 'expo-status-bar';
import { Disc, Music as MusicIcon, Pause, Play, Square } from 'lucide-react-native';
import {
  ActivityIndicator,
  Button,
  FlatList,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useTheme } from '@/core/providers/theme.provinder';

interface MusicSectionProps {
  service: {
    playlists: MusicPlaylist[];
    isLoading: boolean;
    isError: boolean;
    isFetching: boolean;
    onRetry: () => void;
    onPlaySample: (id: string, audioUrl?: string | null) => void;
    onStop: () => void;
  };
  state: {
    currentTrack: string | null;
    isPlaying: boolean;
  };
}

export function MusicSection({ service, state }: MusicSectionProps) {
  const { colors, isDark } = useTheme();
  const { playlists, isLoading, isError, isFetching, onRetry, onPlaySample, onStop } = service;
  const { currentTrack, isPlaying } = state;

  return (
    <SafeAreaView edges={['top', 'bottom']} style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <View className="flex-1 p-4" style={{ backgroundColor: colors.background }}>
        <View className="mb-4">
          <Text className="text-xl font-bold" style={{ color: colors.text }}>
            Lofi & Music Player
          </Text>
          <Text className="text-xs text-gray-500">Audio latar untuk fokus kerja</Text>
        </View>

        {/* Mini Player Bar jika ada track aktif */}
        {currentTrack && (
          <View
            className="flex-row items-center justify-between p-4 mb-4 rounded-2xl border"
            style={{
              backgroundColor: colors.card,
              borderColor: colors.primary,
            }}
          >
            <View className="flex-row items-center flex-1 mr-2">
              {/* ponytail: animate-spin tidak jalan di RN, pakai Animated.loop jika butuh putaran */}
              <Disc size={24} color={colors.primary} />
              <View className="ml-3">
                <Text className="text-xs text-gray-400">Sedang Memutar</Text>
                <Text className="text-sm font-bold" style={{ color: colors.text }}>
                  {playlists.find((p) => p.id === currentTrack)?.name ?? currentTrack}
                </Text>
              </View>
            </View>

            <View className="flex-row items-center gap-2">
              <TouchableOpacity
                onPress={() => onPlaySample(currentTrack)}
                className="p-2 rounded-full"
                style={{ backgroundColor: colors.primary }}
              >
                {isPlaying ? (
                  <Pause size={16} color={colors.primaryForeground} />
                ) : (
                  <Play size={16} color={colors.primaryForeground} />
                )}
              </TouchableOpacity>
              <TouchableOpacity onPress={onStop} className="p-2 rounded-full bg-destructive">
                <Square size={16} color={colors.destructiveForeground} />
              </TouchableOpacity>
            </View>
          </View>
        )}

        {isLoading ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="small" color={colors.primary} />
          </View>
        ) : isError ? (
          <View className="flex-1 items-center justify-center gap-2">
            <Text className="text-sm" style={{ color: colors.text }}>
              Gagal memuat playlist.
            </Text>
            <Button title="Coba lagi" onPress={onRetry} color={colors.primary} />
          </View>
        ) : (
          <FlatList
            data={playlists}
            keyExtractor={(item: MusicPlaylist) => item.id}
            refreshControl={
              <RefreshControl
                refreshing={isFetching && !isLoading}
                onRefresh={onRetry}
                tintColor={colors.primary}
              />
            }
            renderItem={({ item }: { item: MusicPlaylist }) => (
              <View
                className="flex-row items-center justify-between p-4 mb-3 rounded-xl border"
                style={{
                  backgroundColor: colors.card,
                  borderColor: isDark ? colors.border : '#e5e7eb',
                }}
              >
                <View className="flex-row items-center flex-1 mr-2">
                  <View
                    className="w-10 h-10 rounded-lg items-center justify-center"
                    style={{ backgroundColor: colors.primary + '20' }}
                  >
                    <MusicIcon size={20} color={colors.primary} />
                  </View>
                  <View className="ml-3 flex-1">
                    <Text className="text-sm font-bold" style={{ color: colors.text }}>
                      {item.name}
                    </Text>
                    <Text className="text-xs text-gray-500">Playlist Produktivitas</Text>
                  </View>
                </View>

                <TouchableOpacity
                  onPress={() =>
                    onPlaySample(
                      item.id,
                      (item as unknown as { audioUrl?: string | null }).audioUrl ??
                        item.items?.[0]?.youtubeUrl,
                    )
                  }
                  className="p-2 rounded-lg"
                  style={{ backgroundColor: colors.primary + '15' }}
                >
                  {currentTrack === item.id && isPlaying ? (
                    <Pause size={18} color={colors.primary} />
                  ) : (
                    <Play size={18} color={colors.primary} />
                  )}
                </TouchableOpacity>
              </View>
            )}
            ListEmptyComponent={
              <View className="items-center justify-center py-16">
                <Text className="text-xs text-gray-400">Belum ada playlist.</Text>
              </View>
            }
          />
        )}
      </View>
    </SafeAreaView>
  );
}
