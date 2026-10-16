'use client';

import type { CalendarEvent, EventQuery } from '@repo/types';
import { Plus } from 'lucide-react';

import { Button } from '@/components/atoms';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/atoms/Sheet';
import { PageHeader } from '@/components/molecules/PageHeader';
import { EventFormSection } from '@/components/page/private/member/calendar/event-form.section';
import { EventListSection } from '@/components/page/private/member/calendar/event-list.section';

interface CalendarPageSectionProps {
  service: {
    events: CalendarEvent[];
    isLoading: boolean;
    isPending: boolean;
    query: EventQuery;
    createPending: boolean;
    handleDeleteEvent: (id: { id: string }) => void;
    handleSearch: (search: string) => void;
    handlePageChange: (page: number) => void;
    handleSelectEvent: (id: string) => void;
    handleSubmit: (e: React.FormEvent) => void;
  };
  state: {
    open: boolean;
    setOpen: (v: boolean) => void;
    title: string;
    setTitle: (v: string) => void;
    description: string;
    setDescription: (v: string) => void;
    startDate: string;
    setStartDate: (v: string) => void;
  };
}

export function CalendarPageSection({ service, state }: CalendarPageSectionProps) {
  const {
    events,
    isLoading,
    isPending,
    query,
    createPending,
    handleDeleteEvent,
    handleSearch,
    handlePageChange,
    handleSelectEvent,
    handleSubmit,
  } = service;
  const { open, setOpen, title, setTitle, description, setDescription, startDate, setStartDate } =
    state;

  return (
    <div className="">
      <PageHeader
        title="Kalender"
        description="Jadwalkan agenda dan kelola acara harianmu."
        action={
          <div className="lg:hidden">
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button size="icon" className="ghibli-btn rounded-full">
                  <Plus className="size-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="bottom" className="rounded-t-3xl">
                <SheetHeader>
                  <SheetTitle className="font-serif">Jadwal Baru</SheetTitle>
                </SheetHeader>
                <div className="px-4 pb-6">
                  <EventFormSection
                    service={{ handleSubmit }}
                    state={{
                      title,
                      setTitle,
                      description,
                      setDescription,
                      startDate,
                      setStartDate,
                      isPending: createPending,
                    }}
                  />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        }
      />

      <div className="w-full">
        <EventListSection
          service={{
            handleDelete: handleDeleteEvent,
            onSearch: handleSearch,
            onPageChange: handlePageChange,
            handleSelect: handleSelectEvent,
          }}
          state={{
            events,
            isLoading,
            isPending,
            query,
          }}
        />
      </div>
    </div>
  );
}

export default CalendarPageSection;
