import * as Haptics from 'expo-haptics';
import { StatusBar } from 'expo-status-bar';
import { CheckCircle2, Flame, Pause, Play, RotateCcw, Square, Timer } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useTheme } from '@/core/providers/theme.provinder';
import { usePomodoro } from '@/hooks/service/Pomodoro/usePomodoro';

const DEFAULT_MINUTES = 25;
const DEFAULT_SECONDS = DEFAULT_MINUTES * 60;

export function MobilePomodoroContainer() {
  const { colors, isDark } = useTheme();
  const { query, mutate } = usePomodoro();
  const { data: todayStats, isLoading: isStatsLoading, refetch } = query.today();

  const startSession = mutate.start();
  const pauseSession = mutate.pause();
  const resumeSession = mutate.resume();
  const stopSession = mutate.stop();

  const [timeLeft, setTimeLeft] = useState<number>(DEFAULT_SECONDS);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);

  useEffect(() => {
    let interval: any = null;

    if (isRunning && !isPaused && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert('Sesi Selesai!', 'Kerja luar biasa! Waktunya istirahat sejenak.');
      handleStop();
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, isPaused, timeLeft]);

  const handleStart = () => {
    startSession.mutate({ metadata: { type: 'work', duration: DEFAULT_SECONDS } } as any, {
      onSuccess: () => {
        setIsRunning(true);
        setIsPaused(false);
        void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      },
    });
  };

  const handlePause = () => {
    pauseSession.mutate(undefined, {
      onSuccess: () => {
        setIsPaused(true);
        void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      },
    });
  };

  const handleResume = () => {
    resumeSession.mutate(undefined, {
      onSuccess: () => {
        setIsPaused(false);
        void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      },
    });
  };

  const handleStop = () => {
    const elapsed = DEFAULT_SECONDS - timeLeft;
    stopSession.mutate({ duration: elapsed > 0 ? elapsed : 0 } as any, {
      onSuccess: () => {
        setIsRunning(false);
        setIsPaused(false);
        setTimeLeft(DEFAULT_SECONDS);
        void refetch();
        void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      },
    });
  };

  const handleReset = () => {
    setIsRunning(false);
    setIsPaused(false);
    setTimeLeft(DEFAULT_SECONDS);
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  const progressPercent = Math.round(((DEFAULT_SECONDS - timeLeft) / DEFAULT_SECONDS) * 100);

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
                onPress={handleStart}
                disabled={startSession.isPending}
                className="flex-row items-center px-6 py-3 rounded-2xl"
                style={{ backgroundColor: colors.primary }}
              >
                <Play size={18} color="#fff" />
                <Text className="text-white font-bold ml-2 text-sm">
                  {startSession.isPending ? 'Memulai...' : 'Mulai Fokus'}
                </Text>
              </TouchableOpacity>
            ) : (
              <>
                {isPaused ? (
                  <TouchableOpacity
                    onPress={handleResume}
                    disabled={resumeSession.isPending}
                    className="p-3.5 rounded-full"
                    style={{ backgroundColor: colors.primary }}
                  >
                    <Play size={20} color="#fff" />
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    onPress={handlePause}
                    disabled={pauseSession.isPending}
                    className="p-3.5 rounded-full bg-amber-500"
                  >
                    <Pause size={20} color="#fff" />
                  </TouchableOpacity>
                )}

                <TouchableOpacity
                  onPress={handleStop}
                  disabled={stopSession.isPending}
                  className="p-3.5 rounded-full bg-red-500"
                >
                  <Square size={20} color="#fff" />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handleReset}
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
