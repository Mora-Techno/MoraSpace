/** Mirror Prisma model `CalendarEvent` */
export interface ICalendarEvent {
  id: string;
  title: string;
  description: string | null;
  startDate: Date | string;
  endDate: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export type CalendarEvent = Pick<
  ICalendarEvent,
  "id" | "title" | "description"
> & {
  startDate: string;
  endDate: string | null;
  createdAt: string;
  updatedAt: string;
};

export type EventQuery = {
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  month?: string;
  year?: string;
  startDate?: string;
  endDate?: string;
  createdBy?: string;
};

export type PickCreateEvent = Pick<ICalendarEvent, "title" | "description"> & {
  startDate: string;
  endDate?: string;
};

export type PickUpdateEvent = Partial<
  Pick<ICalendarEvent, "title" | "description">
> & {
  startDate?: string;
  endDate?: string | null;
};

export type EventParams = Pick<ICalendarEvent, "id">;

// =============== Respone ===================
