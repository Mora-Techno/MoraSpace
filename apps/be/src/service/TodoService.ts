import prisma from 'prisma/client';
import type { PickCreateTodo, PickUpdateTodo, TodoQuery } from '@repo/types/todo.types';

function mapTodo(todo: {
  id: string;
  title: string;
  completed: boolean;
  dueDate: Date | null;
}) {
  return {
    id: todo.id,
    text: todo.title,
    status: todo.completed ? ('completed' as const) : ('pending' as const),
    dueDate: todo.dueDate?.toISOString() ?? null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

class TodoService {
  public async list(companyMemberId: string, query: TodoQuery) {
    const where: {
      companyMemberId: string;
      completed?: boolean;
      dueDate?: { gte: Date; lt: Date };
    } = { companyMemberId };

    if (query.status) {
      where.completed = query.status === 'completed';
    }

    if (query.date === 'today') {
      const start = new Date();
      start.setHours(0, 0, 0, 0);
      const end = new Date(start);
      end.setDate(end.getDate() + 1);
      where.dueDate = { gte: start, lt: end };
    }

    const todos = await prisma.todo.findMany({
      where,
      orderBy: [{ completed: 'asc' }, { dueDate: 'asc' }],
    });

    return todos.map(mapTodo);
  }

  public async create(companyMemberId: string, input: PickCreateTodo) {
    const todo = await prisma.todo.create({
      data: {
        companyMemberId,
        title: input.text,
        dueDate: input.dueDate ? new Date(input.dueDate) : null,
      },
    });

    return mapTodo(todo);
  }

  public async update(id: string, companyMemberId: string, input: PickUpdateTodo) {
    const existing = await prisma.todo.findFirst({
      where: { id, companyMemberId },
    });
    if (!existing) return null;

    const todo = await prisma.todo.update({
      where: { id },
      data: {
        ...(input.text !== undefined && { title: input.text }),
        ...(input.status !== undefined && { completed: input.status === 'completed' }),
        ...(input.dueDate !== undefined && {
          dueDate: input.dueDate ? new Date(input.dueDate) : null,
        }),
      },
    });

    return mapTodo(todo);
  }

  public async remove(id: string, companyMemberId: string) {
    const existing = await prisma.todo.findFirst({
      where: { id, companyMemberId },
    });
    if (!existing) return null;

    await prisma.todo.delete({ where: { id } });
    return mapTodo(existing);
  }
}

export default new TodoService();
