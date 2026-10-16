'use client';

import type { EventQuery } from '@repo/types';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { CalendarPageSection } from '@/components/page/private/member/calendar/calendar-page.section';
import { useApi } from '@/hooks/useApi/useApi';

export default function CalendarContainer() {
  const [open, setOpen] = useState(false);
  const api = useApi();
  const router = useRouter();

  // Calendar List State
  const [listQuery, setListQuery] = useState<EventQuery>({
    page: 1,
    limit: 10,
    search: '',
  });

  const query: EventQuery = listQuery;

  const { data: events = [], isLoading } = api.calender.query.getCalender(query);
  const deleteEvent = api.calender.mutate.delete();
  const createEvent = api.calender.mutate.create();

  const handleDeleteEvent = (id: { id: string }) => {
    deleteEvent.mutate(id);
  };

  const handleSearch = (search: string) => {
    setListQuery((prev) => ({ ...prev, search, page: 1 }));
  };

  const handlePageChange = (page: number) => {
    setListQuery((prev) => ({ ...prev, page }));
  };

  const handleSelectEvent = (id: string) => {
    router.push(`/member/calendar/${id}`);
  };

  const isListPending = deleteEvent.isPending;

  // Event Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !startDate) return;
    createEvent.mutate(
      {
        title: title.trim(),
        description: description.trim() || null,
        startDate: new Date(startDate).toISOString(),
      },
      {
        onSuccess: () => {
          setTitle('');
          setDescription('');
          setStartDate('');
          setOpen(false);
        },
      },
    );
  };

  return (
    <CalendarPageSection
      service={{
        events,
        isLoading,
        isPending: isListPending,
        query,
        createPending: createEvent.isPending,
        handleDeleteEvent,
        handleSearch,
        handlePageChange,
        handleSelectEvent,
        handleSubmit,
      }}
      state={{
        open,
        setOpen,
        title,
        setTitle,
        description,
        setDescription,
        startDate,
        setStartDate,
      }}
    />
  );
}
