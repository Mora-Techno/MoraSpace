import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Button,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Play, Pause, Square, Music as MusicIcon, Disc } from 'lucide-react-native';
import { useMusic } from '@/hooks/service/Music/useMusic';
import { useTheme } from '@/core/providers/theme.provinder';
import { nativeAudioService } from '@/service/audio.service';
import type { MusicPlaylist } from '@repo/types';

const FALLBACK_AUDIO_URL = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3';

export function MobileMusicContainer() {
  const { colors, isDark } = useTheme();
  const { query } = useMusic();
  const { data: playlists = [], isLoading, isError, refetch, isFetching } = query.getPlayList();

  const [currentTrack, setCurrentTrack] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    void nativeAudioService.setupAudioMode();
    return () => {
      void nativeAudioService.stopTrack();
    };
  }, []);

  const handlePlaySample = (id: string, audioUrl?: string | null) => {
    if (currentTrack === id && isPlaying) {
      void nativeAudioService.pauseTrack();
      setIsPlaying(false);
    } else if (currentTrack === id && !isPlaying) {
      void nativeAudioService.resumeTrack();
      setIsPlaying(true);
    } else {
      setCurrentTrack(id);
      setIsPlaying(true);
      // Sample audio stream untuk demonstrasi audio player native
      void nativeAudioService.playTrack(audioUrl ?? FALLBACK_AUDIO_URL);
    }
  };

  const handleStop = () => {
    void nativeAudioService.stopTrack();
    setIsPlaying(false);
    setCurrentTrack(null);
  };

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
                onPress={() => handlePlaySample(currentTrack)}
                className="p-2 rounded-full"
                style={{ backgroundColor: colors.primary }}
              >
                {isPlaying ? <Pause size={16} color="#fff" /> : <Play size={16} color="#fff" />}
              </TouchableOpacity>
              <TouchableOpacity onPress={handleStop} className="p-2 rounded-full bg-red-500">
                <Square size={16} color="#fff" />
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
            <Button title="Coba lagi" onPress={() => refetch()} color={colors.primary} />
          </View>
        ) : (
          <FlatList
            data={playlists}
            keyExtractor={(item: MusicPlaylist) => item.id}
            refreshControl={
              <RefreshControl
                refreshing={isFetching && !isLoading}
                onRefresh={() => refetch()}
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
                    handlePlaySample(
                      item.id,
                      (item as unknown as { audioUrl?: string | null }).audioUrl ??
                        item.items?.[0]?.youtubeUrl ??
                        FALLBACK_AUDIO_URL,
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
