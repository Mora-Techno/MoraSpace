import { useState } from 'react';
import { Alert } from 'react-native';

import { CalendarSection } from '@/components/section/private/calendar/calendar.section';
import { useCalender } from '@/hooks/service/Calendar/useCalender';

export function MobileCalendarContainer() {
  const { query, mutate } = useCalender();
  const { data: events = [], isLoading, isError, refetch, isFetching } = query.getCalender();
  const createEvent = mutate.create();
  const deleteEvent = mutate.delete();

  const [modalVisible, setModalVisible] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleCreate = () => {
    if (!title.trim()) return;
    const now = new Date();
    const end = new Date(now.getTime() + 60 * 60 * 1000);

    createEvent.mutate(
      {
        title: title.trim(),
        description: description.trim() || null,
        startDate: now.toISOString(),
        endDate: end.toISOString(),
      },
      {
        onSuccess: () => {
          setTitle('');
          setDescription('');
          setModalVisible(false);
        },
      },
    );
  };

  const handleDelete = (id: string) => {
    Alert.alert('Hapus agenda?', 'Agenda yang dihapus tidak dapat dikembalikan.', [
      { text: 'Batal', style: 'cancel' },
      {
        text: 'Hapus',
        style: 'destructive',
        onPress: () => deleteEvent.mutate({ id }),
      },
    ]);
  };

  return (
    <CalendarSection
      service={{
        events,
        isLoading,
        isError,
        isFetching,
        createPending: createEvent.isPending,
        deletePending: deleteEvent.isPending,
        onRetry: () => refetch(),
        onAddOpen: () => setModalVisible(true),
        onDelete: handleDelete,
        onSubmitCreate: handleCreate,
      }}
      state={{
        modalVisible,
        setModalVisible,
        title,
        setTitle,
        description,
        setDescription,
      }}
    />
  );
}
