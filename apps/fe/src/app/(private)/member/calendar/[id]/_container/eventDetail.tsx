'use client';

import type { PickUpdateEvent } from '@repo/types';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { DetailShell } from '@/components/molecules/DetailShell';
import { EventDetailSection } from '@/components/page/private/member/calendar/event-detail.section';
import { useApi } from '@/hooks/useApi/useApi';

function toLocalInput(iso: string | null): string {
  if (!iso) return '';
  const date = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
    date.getDate(),
  )}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export default function EventDetailContainer({ id }: { id: string }) {
  const api = useApi();
  const router = useRouter();
  const pathname = usePathname();
  const listRoute = pathname.includes('/owner/') ? '/owner/calendar' : '/member/calendar';
  const { data: event, isLoading } = api.calender.query.getByID(id);
  const updateEvent = api.calender.mutate.update();
  const deleteEvent = api.calender.mutate.delete();

  const [form, setForm] = useState<PickUpdateEvent>({
    title: '',
    description: '',
    startDate: '',
    endDate: null,
  });

  useEffect(() => {
    if (event) {
      setForm({
        title: event.title,
        description: event.description ?? '',
        startDate: toLocalInput(event.startDate),
        endDate: event.endDate ? toLocalInput(event.endDate) : null,
      });
    }
  }, [event]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!event) return;
    updateEvent.mutate({
      id: { id: event.id },
      payload: {
        title: form.title?.trim() || event.title,
        description: form.description?.trim() || null,
        startDate: form.startDate ? new Date(form.startDate).toISOString() : event.startDate,
        ...(form.endDate ? { endDate: new Date(form.endDate).toISOString() } : { endDate: null }),
      },
    });
  };

  const handleDelete = () => {
    if (!event) return;
    deleteEvent.mutate(
      { id: event.id },
      {
        onSuccess: () => router.push(listRoute),
      },
    );
  };

  return (
    <DetailShell title="Detail Jadwal" backHref={listRoute} isLoading={isLoading}>
      <EventDetailSection
        service={{ handleSave, handleDelete }}
        state={{
          event,
          isLoading,
          isPending: updateEvent.isPending || deleteEvent.isPending,
          form,
          setForm,
        }}
      />
    </DetailShell>
  );
}
