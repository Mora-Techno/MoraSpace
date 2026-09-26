"use client";

import { useState, useEffect } from "react";
import { usePomodoro } from "@/hooks/useApi/pomodoro/usePomodoro";
import { PomodoroSection } from "@/components/page/private/member/pomodoro/pomodoro.section";

const DEFAULT_TIME = 25 * 60;

export default function PomodoroContainer() {
  const { query, mutate } = usePomodoro();
  const { data: todayStats } = query.today();
  const { data: stats } = query.statistics();

  const startSession = mutate.start();
  const pauseSession = mutate.pause();
  const resumeSession = mutate.resume();
  const stopSession = mutate.stop();

  const [timeLeft, setTimeLeft] = useState(DEFAULT_TIME);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning && !isPaused && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      handleStop();
    }
    return () => clearInterval(interval);
  }, [isRunning, isPaused, timeLeft]);

  const handleStart = () => {
    startSession.mutate(
      {},
      {
        onSuccess: () => {
          setIsRunning(true);
          setIsPaused(false);
          setTimeLeft(DEFAULT_TIME);
        },
      },
    );
  };

  const handlePause = () => {
    pauseSession.mutate(undefined, {
      onSuccess: () => {
        setIsPaused(true);
      },
    });
  };

  const handleResume = () => {
    resumeSession.mutate(undefined, {
      onSuccess: () => {
        setIsPaused(false);
      },
    });
  };

  const handleStop = () => {
    stopSession.mutate(undefined, {
      onSuccess: () => {
        setIsRunning(false);
        setIsPaused(false);
        setTimeLeft(DEFAULT_TIME);
      },
    });
  };

  return (
    <PomodoroSection
      service={{
        timeLeft,
        isRunning,
        isPaused,
        handleStart,
        handlePause,
        handleResume,
        handleStop,
        todayMinutes: (todayStats as { totalMinutes?: number })?.totalMinutes ?? 0,
        completedSessions: (stats as { completedSessions?: number })?.completedSessions ?? 0,
        isPending:
          startSession.isPending ||
          pauseSession.isPending ||
          resumeSession.isPending ||
          stopSession.isPending,
      }}
    />
  );
}
