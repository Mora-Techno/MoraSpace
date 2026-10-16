import * as Haptics from 'expo-haptics';
import { useEffect, useState } from 'react';
import { Alert } from 'react-native';

import { PomodoroSection } from '@/components/section/private/pomodoro/pomodoro.section';
import { usePomodoro } from '@/hooks/service/Pomodoro/usePomodoro';

const DEFAULT_MINUTES = 25;
const DEFAULT_SECONDS = DEFAULT_MINUTES * 60;

export function MobilePomodoroContainer() {
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
    <PomodoroSection
      service={{
        todayStats,
        isStatsLoading,
        startPending: startSession.isPending,
        pausePending: pauseSession.isPending,
        resumePending: resumeSession.isPending,
        stopPending: stopSession.isPending,
        formattedTime,
        progressPercent,
        onStart: handleStart,
        onPause: handlePause,
        onResume: handleResume,
        onStop: handleStop,
        onReset: handleReset,
      }}
      state={{
        isRunning,
        setIsRunning,
        isPaused,
        setIsPaused,
      }}
    />
  );
}
