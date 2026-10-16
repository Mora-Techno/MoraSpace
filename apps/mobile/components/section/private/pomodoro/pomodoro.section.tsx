import { StatusBar } from 'expo-status-bar';
import { Flame, Pause, Play, RotateCcw, Square } from 'lucide-react-native';
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useTheme } from '@/core/providers/theme.provinder';

interface PomodoroSectionProps {
  service: {
    todayStats: any;
    isStatsLoading: boolean;
    startPending: boolean;
    pausePending: boolean;
    resumePending: boolean;
    stopPending: boolean;
    formattedTime: string;
    progressPercent: number;
    onStart: () => void;
    onPause: () => void;
    onResume: () => void;
    onStop: () => void;
    onReset: () => void;
  };
  state: {
    isRunning: boolean;
    setIsRunning: (v: boolean) => void;
    isPaused: boolean;
    setIsPaused: (v: boolean) => void;
  };
}

export function PomodoroSection({ service, state }: PomodoroSectionProps) {
  const { colors, isDark } = useTheme();
  const {
    todayStats,
    isStatsLoading,
    startPending,
    pausePending,
    resumePending,
    stopPending,
    formattedTime,
    progressPercent,
    onStart,
    onPause,
    onResume,
    onStop,
    onReset,
  } = service;
  const { isRunning, isPaused } = state;

  return (
    <SafeAreaView edges={['top', 'bottom']} style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, padding: 20 }}
        style={{ backgroundColor: colors.background }}
      >
        <View className="mb-6">
          <Text className="text-2xl font-bold" style={{ color: colors.text }}>
            Pomodoro Timer
          </Text>
          <Text className="text-xs text-gray-500 mt-0.5">
            Tingkatkan konsentrasi kerja dengan interval fokus
          </Text>
        </View>

        {/* Circular Display Card */}
        <View
          className="items-center justify-center p-8 rounded-3xl border mb-6"
          style={{
            backgroundColor: colors.card,
            borderColor: isRunning ? colors.primary : colors.border,
          }}
        >
          <View
            className="w-48 h-48 rounded-full items-center justify-center border-4"
            style={{
              borderColor: isRunning ? colors.primary : isDark ? '#374151' : '#e5e7eb',
              backgroundColor: isRunning ? colors.primary + '10' : 'transparent',
            }}
          >
            <Text
              className="text-4xl font-extrabold tracking-widest"
              style={{ color: colors.text }}
            >
              {formattedTime}
            </Text>
            <Text className="text-xs text-gray-400 mt-1">
              {isRunning ? (isPaused ? 'Dijeda' : 'Sedang Fokus') : 'Siap Mulai'}
            </Text>
            {isRunning ? (
              <Text className="text-[10px] font-semibold mt-1" style={{ color: colors.primary }}>
                {progressPercent}%
              </Text>
            ) : null}
          </View>

          {/* Controls */}
          <View className="flex-row items-center justify-center gap-4 mt-8">
            {!isRunning ? (
              <TouchableOpacity
                onPress={onStart}
                disabled={startPending}
                className="flex-row items-center px-6 py-3 rounded-2xl"
                style={{ backgroundColor: colors.primary }}
              >
                <Play size={18} color={colors.primaryForeground} />
                <Text className="text-primary-foreground font-bold ml-2 text-sm">
                  {startPending ? 'Memulai...' : 'Mulai Fokus'}
                </Text>
              </TouchableOpacity>
            ) : (
              <>
                {isPaused ? (
                  <TouchableOpacity
                    onPress={onResume}
                    disabled={resumePending}
                    className="p-3.5 rounded-full"
                    style={{ backgroundColor: colors.primary }}
                  >
                    <Play size={20} color={colors.primaryForeground} />
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    onPress={onPause}
                    disabled={pausePending}
                    className="p-3.5 rounded-full bg-warning"
                  >
                    <Pause size={20} color={colors.warningForeground} />
                  </TouchableOpacity>
                )}

                <TouchableOpacity
                  onPress={onStop}
                  disabled={stopPending}
                  className="p-3.5 rounded-full bg-destructive"
                >
                  <Square size={20} color={colors.destructiveForeground} />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={onReset}
                  className="p-3.5 rounded-full border"
                  style={{ borderColor: colors.border }}
                >
                  <RotateCcw size={20} color={colors.textSecondary} />
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>

        {/* Stats Card */}
        <View
          className="p-5 rounded-2xl border"
          style={{
            backgroundColor: colors.card,
            borderColor: colors.border,
          }}
        >
          <View className="flex-row items-center mb-3">
            <Flame size={18} color="#f97316" />
            <Text className="text-sm font-bold ml-2" style={{ color: colors.text }}>
              Statistik Fokus Hari Ini
            </Text>
          </View>

          {isStatsLoading ? (
            <ActivityIndicator size="small" color={colors.primary} />
          ) : (
            <View className="flex-row justify-around py-2">
              <View className="items-center">
                <Text className="text-xl font-bold" style={{ color: colors.primary }}>
                  {(todayStats as any)?.completedSessions ??
                    (todayStats as any)?.sessionsCount ??
                    0}
                </Text>
                <Text className="text-[11px] text-gray-400 mt-1">Sesi Selesai</Text>
              </View>
              <View className="w-[1px] bg-gray-200 dark:bg-gray-800" />
              <View className="items-center">
                <Text className="text-xl font-bold" style={{ color: colors.primary }}>
                  {Math.round(
                    (todayStats as any)?.totalMinutes ?? (todayStats as any)?.minutesFocused ?? 0,
                  )}
                  m
                </Text>
                <Text className="text-[11px] text-gray-400 mt-1">Total Waktu</Text>
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
