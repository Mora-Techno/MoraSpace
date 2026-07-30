"use client";

import { format, isSameDay } from "date-fns";
import { useMemo, useState } from "react";

import { Calendar } from "@/components/atoms/Calendar";
import { PageHeader } from "@/components/molecules/PageHeader";
import { EventFormSection } from "@/components/page/private/member/calendar/event-form.section";
import { EventListSection } from "@/components/page/private/member/calendar/event-list.section";
import {
  useCreateEvent,
  useDeleteEvent,
  useEvents,
} from "@/hooks/useApi/calendar";
import type { EventQuery } from "@repo/types";

export default function CalendarContainer() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const query: EventQuery | undefined = useMemo(() => {
    const month = String(selectedDate.getMonth() + 1).padStart(2, "0");
    const year = String(selectedDate.getFullYear());
    return { month, year };
  }, [selectedDate]);

  const { data: events = [], isLoading } = useEvents(query);
  const deleteEvent = useDeleteEvent();
  const createEvent = useCreateEvent();

  const dayEvents = events.filter((e) =>
    isSameDay(new Date(e.startDate), selectedDate),
  );

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");

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
          setTitle("");
          setDescription("");
          setStartDate("");
        },
      },
    );
  };

  return (
    <div className="animate-in fade-in duration-700">
      <PageHeader
        title="Kalender"
        description="Jadwalkan agenda dan kelola acara harianmu."
      />

      <div className="grid grid-cols-1 gap-6 md:flex md:gap-8 ">
        <div className="ghibli-glass w-full shrink-0 rounded-2xl p-4 md:w-auto ">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={(date) => date && setSelectedDate(date)}
            className="w-full"
          />
        </div>

        <div className="flex flex-1 flex-col gap-4">
          <EventListSection
            service={{ handleDelete: (id) => deleteEvent.mutate(id) }}
            state={{
              dayEvents,
              isLoading,
              selectedDate,
            }}
          />
          <EventFormSection
            service={{ handleSubmit }}
            state={{
              title,
              setTitle,
              description,
              setDescription,
              startDate,
              setStartDate,
              selectedDate,
              isPending: createEvent.isPending,
            }}
          />
        </div>
      </div>
    </div>
  );
}
