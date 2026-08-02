"use client";

import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/atoms";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/atoms/Sheet";
import { PageHeader } from "@/components/molecules/PageHeader";
import { EventFormSection } from "@/components/page/private/member/calendar/event-form.section";
import { EventListSection } from "@/components/page/private/member/calendar/event-list.section";
import { useApi } from "@/hooks/useApi/useApi";
import type { EventQuery } from "@repo/types";

export default function CalendarContainer() {
  const [open, setOpen] = useState(false);
  const api = useApi();
  const router = useRouter();

  // Calendar List State
  const [listQuery, setListQuery] = useState<EventQuery>({
    page: 1,
    limit: 10,
    search: "",
  });

  const query: EventQuery = listQuery;

  const { data: events = [], isLoading } =
    api.calender.query.getCalender(query);
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
          setOpen(false);
        },
      },
    );
  };

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
                      isPending: createEvent.isPending,
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
            isPending: isListPending,
            query: listQuery,
          }}
        />
      </div>
    </div>
  );
}
