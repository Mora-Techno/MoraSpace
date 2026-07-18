'use client';

import { useMemo, useState } from 'react';

import { Calendar } from '@/components/atoms/calendar';
import { PageHeader } from '@/components/molecules/page-header';

import { EventFormSection } from '../_sections/event-form.section';
import { EventListSection } from '../_sections/event-list.section';

export default function CalendarContainer() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const query = useMemo(() => {
    const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
    const year = String(selectedDate.getFullYear());
    return { month, year };
  }, [selectedDate]);

  return (
    <div className="animate-in fade-in duration-700">
      <PageHeader title="Kalender" description="Jadwalkan agenda dan kelola acara harianmu." />

      <div className="grid grid-cols-1 gap-6 md:flex md:gap-8">
        <div className="ghibli-glass w-full shrink-0 rounded-2xl p-4 md:w-auto">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={(date) => date && setSelectedDate(date)}
            className="w-full"
          />
        </div>

        <div className="flex flex-1 flex-col gap-4">
          <EventListSection selectedDate={selectedDate} query={query} />
          <EventFormSection selectedDate={selectedDate} query={query} />
        </div>
      </div>
    </div>
  );
}
