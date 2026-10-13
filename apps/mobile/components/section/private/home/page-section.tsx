import type { Todo } from '@repo/types/todo.types';
import { router } from 'expo-router';
import {
  ArrowRight,
  Calendar as CalendarIcon,
  CheckCircle2,
  Circle,
  Clock,
  Kanban,
  ListTodo,
  Play,
  Sparkles,
  Timer,
} from 'lucide-react-native';
import React, { useMemo } from 'react';
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { useTheme } from '@/core/providers/theme.provinder';
import { useCalender } from '@/hooks/service/Calendar/useCalender';
import { useTask } from '@/hooks/service/Task/useTask';
import { useTodo } from '@/hooks/service/Todo/useTodo';
import { useAppSelector } from '@/hooks/toolkit/redux';

export default function HomePageSection() {
  const { colors, isDark } = useTheme();
  const currentUser = useAppSelector((state) => state.auth.currentUser?.user);
  const fullName = currentUser?.fullName || 'Rekan Kerja';

  // Greeting & Date
  const { greeting, formattedDate } = useMemo(() => {
    const now = new Date();
    const hour = now.getHours();
    let greet = 'Selamat Pagi';
    if (hour >= 11 && hour < 15) greet = 'Selamat Siang';
    else if (hour >= 15 && hour < 18) greet = 'Selamat Sore';
    else if (hour >= 18 || hour < 4) greet = 'Selamat Malam';

    const dateStr = new Intl.DateTimeFormat('id-ID', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(now);

    return { greeting: greet, formattedDate: dateStr };
  }, []);

  // Data fetching
  const { query: todoQuery, mutate: todoMutate } = useTodo();
  const { data: todos = [], isLoading: isTodosLoading, refetch: refetchTodos } = todoQuery.get();
  const updateTodo = todoMutate.update();

  const { query: calQuery } = useCalender();
  const {
    data: events = [],
    isLoading: isCalLoading,
    refetch: refetchCal,
  } = calQuery.getCalender();

  const { query: taskQuery } = useTask();
  const { data: tasks = [], isLoading: isTasksLoading, refetch: refetchTasks } = taskQuery.list();

  // Metrics
  const pendingTodos = useMemo(() => {
    if (!Array.isArray(todos)) return [];
    return todos.filter((t) => t.status !== 'completed');
  }, [todos]);

  const todayEvents = useMemo(() => {
    if (!Array.isArray(events)) return [];
    const todayStr = new Date().toDateString();
    return events.filter((e) => new Date(e.startDate).toDateString() === todayStr);
  }, [events]);

  const activeTasksCount = useMemo(() => {
    if (!Array.isArray(tasks)) return 0;
    return tasks.length;
  }, [tasks]);

  const handleToggleTodo = (todo: Todo) => {
    const nextStatus = todo.status === 'completed' ? 'pending' : 'completed';
    updateTodo.mutate({
      id: todo.id,
      payload: { status: nextStatus },
    });
  };

  const handleRefreshAll = () => {
    void refetchTodos();
    if (refetchCal) void refetchCal();
    if (refetchTasks) void refetchTasks();
  };

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1, padding: 18 }}
      style={{ backgroundColor: colors.background }}
      refreshControl={
        <RefreshControl
          refreshing={false}
          onRefresh={handleRefreshAll}
          tintColor={colors.primary}
        />
      }
    >
      {/* Greeting Header */}
      <View className="mb-6">
        <View className="flex-row items-center gap-1.5 mb-1">
          <Sparkles size={14} color={colors.primary} />
          <Text className="text-xs font-semibold" style={{ color: colors.primary }}>
            {formattedDate}
          </Text>
        </View>
        <Text className="text-2xl font-extrabold" style={{ color: colors.text }}>
          {greeting}, {fullName}!
        </Text>
        <Text className="text-xs text-gray-500 mt-1">
          Pantau progres kerja dan agenda hari ini di ruang kerja Anda.
        </Text>
      </View>

      {/* KPI Stats Grid */}
      <View className="flex-row gap-3 mb-6">
        <View
          className="flex-1 p-3.5 rounded-2xl border"
          style={{ backgroundColor: colors.card, borderColor: colors.border }}
        >
          <View className="flex-row items-center justify-between mb-1">
            <ListTodo size={16} color={colors.primary} />
            <Text className="text-lg font-bold" style={{ color: colors.text }}>
              {pendingTodos.length}
            </Text>
          </View>
          <Text className="text-[11px] text-gray-400">Todo Pending</Text>
        </View>

        <View
          className="flex-1 p-3.5 rounded-2xl border"
          style={{ backgroundColor: colors.card, borderColor: colors.border }}
        >
          <View className="flex-row items-center justify-between mb-1">
            <CalendarIcon size={16} color="#3b82f6" />
            <Text className="text-lg font-bold" style={{ color: colors.text }}>
              {todayEvents.length}
            </Text>
          </View>
          <Text className="text-[11px] text-gray-400">Agenda Hari Ini</Text>
        </View>

        <View
          className="flex-1 p-3.5 rounded-2xl border"
          style={{ backgroundColor: colors.card, borderColor: colors.border }}
        >
          <View className="flex-row items-center justify-between mb-1">
            <Kanban size={16} color="#10b981" />
            <Text className="text-lg font-bold" style={{ color: colors.text }}>
              {activeTasksCount}
            </Text>
          </View>
          <Text className="text-[11px] text-gray-400">Tugas Aktif</Text>
        </View>
      </View>

      {/* Quick Pomodoro Banner */}
      <TouchableOpacity
        onPress={() => router.push('/(private)/pomodoro/page' as any)}
        activeOpacity={0.8}
        className="flex-row items-center justify-between p-4 rounded-2xl mb-6"
        style={{ backgroundColor: colors.primary }}
      >
        <View className="flex-row items-center flex-1 mr-3">
          <View className="w-10 h-10 rounded-full bg-white/20 items-center justify-center">
            <Timer size={22} color={colors.primaryForeground} />
          </View>
          <View className="ml-3 flex-1">
            <Text className="text-sm font-bold text-primary-foreground">Mulai Sesi Fokus</Text>
            <Text className="text-[11px] text-primary-foreground/80 mt-0.5">
              Timer Pomodoro 25 menit untuk produktivitas maksimal
            </Text>
          </View>
        </View>
        <View className="w-8 h-8 rounded-full bg-white/25 items-center justify-center">
          <Play size={16} color={colors.primaryForeground} />
        </View>
      </TouchableOpacity>

      {/* Pending Todos Preview */}
      <View
        className="p-4 rounded-2xl border mb-6"
        style={{ backgroundColor: colors.card, borderColor: colors.border }}
      >
        <View className="flex-row items-center justify-between mb-3">
          <Text className="text-sm font-bold" style={{ color: colors.text }}>
            Daftar Tugas Harian
          </Text>
          <TouchableOpacity
            onPress={() => router.push('/(private)/(tabs)/todos/page' as any)}
            className="flex-row items-center"
          >
            <Text className="text-xs font-semibold mr-1" style={{ color: colors.primary }}>
              Semua
            </Text>
            <ArrowRight size={12} color={colors.primary} />
          </TouchableOpacity>
        </View>

        {isTodosLoading ? (
          <ActivityIndicator size="small" color={colors.primary} className="py-4" />
        ) : pendingTodos.length === 0 ? (
          <View className="items-center py-5">
            <Text className="text-xs text-gray-400">Semua tugas harian telah tuntas!</Text>
          </View>
        ) : (
          pendingTodos.slice(0, 4).map((item) => (
            <TouchableOpacity
              key={item.id}
              onPress={() => handleToggleTodo(item)}
              className="flex-row items-center py-2.5 border-b border-gray-100 dark:border-gray-800 last:border-b-0"
            >
              <Circle size={18} color={colors.textSecondary} />
              <Text
                className="text-xs font-medium ml-3 flex-1"
                style={{ color: colors.text }}
                numberOfLines={1}
              >
                {item.text}
              </Text>
            </TouchableOpacity>
          ))
        )}
      </View>

      {/* Upcoming Events Preview */}
      <View
        className="p-4 rounded-2xl border mb-6"
        style={{ backgroundColor: colors.card, borderColor: colors.border }}
      >
        <View className="flex-row items-center justify-between mb-3">
          <Text className="text-sm font-bold" style={{ color: colors.text }}>
            Agenda Mendatang
          </Text>
          <TouchableOpacity
            onPress={() => router.push('/(private)/(tabs)/calendar/page' as any)}
            className="flex-row items-center"
          >
            <Text className="text-xs font-semibold mr-1" style={{ color: colors.primary }}>
              Kalender
            </Text>
            <ArrowRight size={12} color={colors.primary} />
          </TouchableOpacity>
        </View>

        {isCalLoading ? (
          <ActivityIndicator size="small" color={colors.primary} className="py-4" />
        ) : events.length === 0 ? (
          <View className="items-center py-5">
            <Text className="text-xs text-gray-400">Belum ada agenda terdaftar.</Text>
          </View>
        ) : (
          events.slice(0, 3).map((e: any) => (
            <View
              key={e.id}
              className="flex-row items-center justify-between py-2.5 border-b border-gray-100 dark:border-gray-800 last:border-b-0"
            >
              <View className="flex-1 mr-2">
                <Text
                  className="text-xs font-bold"
                  style={{ color: colors.text }}
                  numberOfLines={1}
                >
                  {e.title}
                </Text>
                <View className="flex-row items-center gap-1 mt-1">
                  <Clock size={10} color={colors.textSecondary} />
                  <Text className="text-[10px] text-gray-400">
                    {new Date(e.startDate).toLocaleDateString()}
                  </Text>
                </View>
              </View>
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
}
