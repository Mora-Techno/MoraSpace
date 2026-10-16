import type { Todo } from '@repo/types/todo.types';
import { router } from 'expo-router';
import { useMemo } from 'react';

import HomePageSection from '@/components/section/private/home/page-section';
import { useCalender } from '@/hooks/service/Calendar/useCalender';
import { useTask } from '@/hooks/service/Task/useTask';
import { useTodo } from '@/hooks/service/Todo/useTodo';
import { useAppSelector } from '@/hooks/toolkit/redux';

const HomePageContainer = () => {
  const currentUser = useAppSelector((state) => state.auth.currentUser?.user);
  const fullName = currentUser?.fullName || 'Rekan Kerja';

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
  const { data: tasks = [], refetch: refetchTasks } = taskQuery.list();

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
    <HomePageSection
      service={{
        pendingTodos,
        todayEventsCount: todayEvents.length,
        activeTasksCount,
        events,
        isTodosLoading,
        isCalLoading,
        handleToggleTodo,
        handleRefreshAll,
        goPomodoro: () => router.push('/(private)/pomodoro/page' as any),
        goTodos: () => router.push('/(private)/(tabs)/todos/page' as any),
        goCalendar: () => router.push('/(private)/(tabs)/calendar/page' as any),
      }}
      state={{ fullName, greeting, formattedDate }}
    />
  );
};

export default HomePageContainer;
