import prisma from "prisma/client";
import type {
  PickCreateTodo,
  PickUpdateTodo,
  TodoQuery,
} from "@repo/types/todo.types";

function mapTodo(todo: {
  id: string;
  title: string;
  completed: boolean;
  dueDate: Date | null;
}) {
  return {
    id: todo.id,
    text: todo.title,
    status: todo.completed ? ("completed" as const) : ("pending" as const),
    dueDate: todo.dueDate?.toISOString() ?? null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

class TodoService {
  public async list(
    companyMemberId: string | null,
    userId: string,
    query: TodoQuery & {
      search?: string;
      page?: number;
      limit?: number;
      startDate?: string;
      endDate?: string;
      sortBy?: string;
      sortOrder?: "asc" | "desc";
    },
  ) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};
    if (companyMemberId) {
      where.companyMemberId = companyMemberId;
    } else {
      where.userId = userId;
    }

    if (query.search) {
      where.title = { contains: query.search, mode: "insensitive" };
    }

    if (query.status) {
      where.completed = query.status === "completed";
    }

    if (query.date === "today") {
      const start = new Date();
      start.setHours(0, 0, 0, 0);
      const end = new Date(start);
      end.setDate(end.getDate() + 1);
      where.dueDate = { gte: start, lt: end };
    }

    if (query.startDate || query.endDate) {
      where.dueDate = {
        ...((where.dueDate as Record<string, unknown>) || {}),
        ...(query.startDate ? { gte: new Date(query.startDate) } : {}),
        ...(query.endDate ? { lte: new Date(query.endDate) } : {}),
      };
    }

    const orderBy: Record<string, unknown>[] = [];
    if (query.sortBy) {
      orderBy.push({ [query.sortBy]: query.sortOrder ?? "asc" });
    } else {
      orderBy.push({ completed: "asc" });
      orderBy.push({ dueDate: "asc" });
    }

    const [totalData, todos] = await prisma.$transaction([
      prisma.todo.count({ where: where as any }),
      prisma.todo.findMany({
        where: where as any,
        orderBy: orderBy as any,
        take: limit,
        skip: skip,
      }),
    ]);

    const totalPage = Math.ceil(totalData / limit);

    return {
      data: todos.map(mapTodo),
      meta: {
        currentPage: page,
        limit,
        totalData,
        totalPage,
      },
    };
  }

  public async getById(
    id: string,
    companyMemberId: string | null,
    userId: string,
  ) {
    const whereFilter: Record<string, unknown> = { id };
    if (companyMemberId) {
      whereFilter.companyMemberId = companyMemberId;
    } else {
      whereFilter.userId = userId;
    }

    const todo = await prisma.todo.findFirst({
      where: whereFilter as any,
    });
    if (!todo) return null;

    return mapTodo(todo);
  }

  public async create(
    companyMemberId: string | null,
    userId: string,
    input: PickCreateTodo,
  ) {
    const data: Record<string, unknown> = {
      title: input.text,
      dueDate: input.dueDate ? new Date(input.dueDate) : null,
    };
    if (companyMemberId) {
      data.companyMemberId = companyMemberId;
    } else {
      data.userId = userId;
    }

    const todo = await prisma.todo.create({
      data: data as any,
    });

    return mapTodo(todo);
  }

  public async update(
    id: string,
    companyMemberId: string | null,
    userId: string,
    input: PickUpdateTodo,
  ) {
    const whereFilter: Record<string, unknown> = { id };
    if (companyMemberId) {
      whereFilter.companyMemberId = companyMemberId;
    } else {
      whereFilter.userId = userId;
    }

    const existing = await prisma.todo.findFirst({
      where: whereFilter as any,
    });
    if (!existing) return null;

    const todo = await prisma.todo.update({
      where: { id },
      data: {
        ...(input.text !== undefined && { title: input.text }),
        ...(input.status !== undefined && {
          completed: input.status === "completed",
        }),
        ...(input.dueDate !== undefined && {
          dueDate: input.dueDate ? new Date(input.dueDate) : null,
        }),
      },
    });

    return mapTodo(todo);
  }

  public async remove(
    id: string,
    companyMemberId: string | null,
    userId: string,
  ) {
    const whereFilter: Record<string, unknown> = { id };
    if (companyMemberId) {
      whereFilter.companyMemberId = companyMemberId;
    } else {
      whereFilter.userId = userId;
    }

    const existing = await prisma.todo.findFirst({
      where: whereFilter as any,
    });
    if (!existing) return null;

    await prisma.todo.delete({ where: { id } });
    return mapTodo(existing);
  }
}

export default new TodoService();
