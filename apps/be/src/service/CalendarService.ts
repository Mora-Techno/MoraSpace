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
  public async list(
    companyId: string,
    query: EventQuery & {
      search?: string;
      page?: number;
      limit?: number;
      sortBy?: string;
      sortOrder?: "asc" | "desc";
      startDate?: string;
      endDate?: string;
      createdBy?: string;
    },
  ) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = { companyId };

    if (query.search) {
      where.title = { contains: query.search, mode: "insensitive" };
    }

    if (query.month && query.year) {
      const month = Number(query.month) - 1;
      const year = Number(query.year);
      const start = new Date(year, month, 1);
      const end = new Date(year, month + 1, 1);
      where.startTime = { gte: start, lt: end };
    }

    if (query.startDate || query.endDate) {
      where.startTime = {
        ...((where.startTime as Record<string, unknown>) || {}),
        ...(query.startDate ? { gte: new Date(query.startDate) } : {}),
        ...(query.endDate ? { lte: new Date(query.endDate) } : {}),
      };
    }

    if (query.createdBy) {
      where.createdBy = query.createdBy;
    }

    const orderBy: Record<string, unknown> = {};
    if (query.sortBy) {
      orderBy[query.sortBy] = query.sortOrder ?? "asc";
    } else {
      orderBy.startTime = "asc";
    }

    const [totalData, events] = await prisma.$transaction([
      prisma.calendarEvent.count({ where: where as any }),
      prisma.calendarEvent.findMany({
        where: where as any,
        orderBy,
        skip: skip,
        take: limit,
      }),
    ]);

    const totalPage = Math.ceil(totalData / limit);

    return {
      data: events.map(mapEvent),
      meta: {
        currentPage: page,
        limit,
        totalData,
        totalPage,
      },
    };
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
