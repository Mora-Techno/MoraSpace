import prisma from "prisma/client";
import type {
  PickCreateEvent,
  EventQuery,
  PickUpdateEvent,
} from "@repo/types/calendar.types";

function mapEvent(event: {
  id: string;
  title: string;
  description: string | null;
  startTime: Date;
  endTime: Date;
}) {
  return {
    id: event.id,
    title: event.title,
    description: event.description,
    startDate: event.startTime.toISOString(),
    endDate: event.endTime.toISOString(),
    createdAt: event.startTime.toISOString(),
    updatedAt: event.endTime.toISOString(),
  };
}

class CalendarService {
  public async list(companyId: string, query: EventQuery) {
    const where: {
      companyId: string;
      startTime?: { gte: Date; lt: Date };
    } = { companyId };

    if (query.month && query.year) {
      const month = Number(query.month) - 1;
      const year = Number(query.year);
      const start = new Date(year, month, 1);
      const end = new Date(year, month + 1, 1);
      where.startTime = { gte: start, lt: end };
    }

    const events = await prisma.calendarEvent.findMany({
      where,
      orderBy: { startTime: "asc" },
    });

    return events.map(mapEvent);
  }

  public async create(
    companyId: string,
    companyMemberId: string,
    input: PickCreateEvent,
  ) {
    const event = await prisma.calendarEvent.create({
      data: {
        companyId,
        createdBy: companyMemberId,
        title: input.title,
        description: input.description,
        startTime: new Date(input.startDate),
        endTime: input.endDate
          ? new Date(input.endDate)
          : new Date(input.startDate),
      },
    });

    return mapEvent(event);
  }

  public async update(id: string, companyId: string, input: PickUpdateEvent) {
    const existing = await prisma.calendarEvent.findFirst({
      where: { id, companyId },
    });
    if (!existing) return null;

    const event = await prisma.calendarEvent.update({
      where: { id },
      data: {
        ...(input.title !== undefined && { title: input.title }),
        ...(input.description !== undefined && {
          description: input.description,
        }),
        ...(input.startDate !== undefined && {
          startTime: new Date(input.startDate),
        }),
        ...(input.endDate !== undefined && {
          endTime: input.endDate ? new Date(input.endDate) : existing.endTime,
        }),
      },
    });

    return mapEvent(event);
  }

  public async remove(id: string, companyId: string) {
    const existing = await prisma.calendarEvent.findFirst({
      where: { id, companyId },
    });
    if (!existing) return null;

    await prisma.calendarEvent.delete({ where: { id } });
    return mapEvent(existing);
  }
}

export default new CalendarService();
