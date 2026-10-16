import type {
  PickAddTaskAttachment,
  PickCreateTask,
  PickCreateTaskChecklist,
  PickUpdateTask,
} from '@repo/types/task.types';
import prisma from 'prisma/client';
import { DEFAULT_TASK_STATUSES } from '@/config/companyDefaults';

export interface TaskViewer {
  companyRole?: string;
  companyMemberId?: string | null;
  userId?: string;
}

const DEFAULT_PRIORITIES = [
  { id: 'low', name: 'Rendah', color: '#10b981', level: 1 },
  { id: 'medium', name: 'Sedang', color: '#f59e0b', level: 2 },
  { id: 'high', name: 'Tinggi', color: '#ef4444', level: 3 },
  { id: 'urgent', name: 'Mendesak', color: '#dc2626', level: 4 },
];

class TaskService {
  public async listStatuses(companyId?: string | null, userId?: string) {
    const whereClause: Record<string, unknown> = companyId
      ? { companyId }
      : { userId, companyId: null };

    let statuses = await prisma.taskStatus.findMany({
      where: whereClause as any,
      orderBy: { sortOrder: 'asc' },
    });

    if (statuses.length === 0 && typeof prisma.taskStatus?.createMany === 'function') {
      await prisma.taskStatus.createMany({
        data: DEFAULT_TASK_STATUSES.map((status) => ({
          name: status.name,
          color: status.color,
          sortOrder: status.sortOrder,
          companyId: companyId ?? null,
          userId: companyId ? null : (userId ?? null),
        })),
      });
      statuses = await prisma.taskStatus.findMany({
        where: whereClause as any,
        orderBy: { sortOrder: 'asc' },
      });
    }

    return statuses;
  }

  public async createStatus(
    companyId: string | null,
    userId: string,
    input: { name: string; color?: string; sortOrder?: number },
  ) {
    const whereClause: Record<string, unknown> = companyId
      ? { companyId }
      : { userId, companyId: null };

    let sortOrder = input.sortOrder;
    if (typeof sortOrder !== 'number') {
      const highest = await prisma.taskStatus.findFirst({
        where: whereClause as any,
        orderBy: { sortOrder: 'desc' },
        select: { sortOrder: true },
      });
      sortOrder = (highest?.sortOrder ?? -1) + 1;
    }

    return prisma.taskStatus.create({
      data: {
        companyId: companyId ?? null,
        userId: companyId ? null : userId,
        name: input.name.trim(),
        color: input.color?.trim() || '#3b82f6',
        sortOrder,
      },
    });
  }

  public async updateStatusItem(
    id: string,
    companyId: string | null,
    userId: string,
    input: { name?: string; color?: string; sortOrder?: number },
  ) {
    const whereClause: Record<string, unknown> = companyId ? { id, companyId } : { id, userId };

    const existing = await prisma.taskStatus.findFirst({
      where: whereClause as any,
    });
    if (!existing) {
      throw new Error('Status tugas tidak ditemukan');
    }

    return prisma.taskStatus.update({
      where: { id },
      data: {
        ...(input.name !== undefined ? { name: input.name.trim() } : {}),
        ...(input.color !== undefined ? { color: input.color.trim() } : {}),
        ...(typeof input.sortOrder === 'number' ? { sortOrder: input.sortOrder } : {}),
      },
    });
  }

  public async deleteStatusItem(id: string, companyId: string | null, userId: string) {
    const whereClause: Record<string, unknown> = companyId ? { id, companyId } : { id, userId };

    const existing = await prisma.taskStatus.findFirst({
      where: whereClause as any,
    });
    if (!existing) {
      throw new Error('Status tugas tidak ditemukan');
    }

    const scopeWhere: Record<string, unknown> = companyId
      ? { companyId }
      : { userId, companyId: null };

    const totalStatuses = await prisma.taskStatus.count({
      where: scopeWhere as any,
    });
    if (totalStatuses <= 1) {
      throw new Error(
        'Tidak dapat menghapus status terakhir. Workspace minimal harus memiliki 1 status.',
      );
    }

    const inUseWhere: Record<string, unknown> = companyId
      ? { companyId, statusId: id }
      : { userId, statusId: id };

    const inUseCount = await prisma.task.count({
      where: inUseWhere as any,
    });
    if (inUseCount > 0) {
      throw new Error(
        `Status masih digunakan oleh ${inUseCount} tugas. Pindahkan tugas ke status lain terlebih dahulu.`,
      );
    }

    await prisma.taskStatus.delete({
      where: { id },
    });

    return { id };
  }

  public async listPriorities(companyId?: string | null, _userId?: string) {
    if (companyId) {
      const dbPriorities = await prisma.taskPriority.findMany({
        where: { companyId },
        orderBy: { level: 'asc' },
      });
      if (dbPriorities.length > 0) return dbPriorities;
    }
    return DEFAULT_PRIORITIES;
  }

  public async list(
    companyId: string | null,
    userId: string,
    query: {
      search?: string;
      statusId?: string;
      priorityId?: string;
      assigneeId?: string;
      reporterMemberId?: string;
      startDate?: string;
      endDate?: string;
      page?: number;
      limit?: number;
      sortBy?: string;
      sortOrder?: 'asc' | 'desc';
    } = {},
    viewer?: TaskViewer,
  ) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};

    if (companyId) {
      where.companyId = companyId;
      if (query.assigneeId) {
        where.assignees = {
          some: { companyMemberId: query.assigneeId },
        };
      }
      if (query.reporterMemberId) {
        where.reporterMemberId = query.reporterMemberId;
      }
      // v0.0.1: Member hanya lihat task sendiri (reporter/assignee). Owner lihat semua.
      if (viewer?.companyRole !== 'Owner' && viewer?.companyMemberId) {
        where.OR = [
          { reporterMemberId: viewer.companyMemberId },
          { assignees: { some: { companyMemberId: viewer.companyMemberId } } },
        ];
      }
    } else {
      where.userId = userId;
    }

    if (query.search) {
      where.title = { contains: query.search, mode: 'insensitive' };
    }

    if (query.statusId) {
      where.statusId = query.statusId;
    }

    if (query.priorityId) {
      where.priorityId = query.priorityId;
    }

    if (query.startDate || query.endDate) {
      where.dueDate = {};
      if (query.startDate)
        (where.dueDate as Record<string, unknown>).gte = new Date(query.startDate);
      if (query.endDate) (where.dueDate as Record<string, unknown>).lte = new Date(query.endDate);
    }

    const orderBy: Record<string, unknown> = {};
    if (query.sortBy) {
      orderBy[query.sortBy] = query.sortOrder ?? 'desc';
    } else {
      orderBy.createdAt = 'desc';
    }

    const [totalData, data] = await prisma.$transaction([
      prisma.task.count({ where: where as any }),
      prisma.task.findMany({
        where: where as any,
        include: {
          status: true,
          priority: true,
          reporter: {
            include: {
              user: {
                select: {
                  id: true,
                  fullName: true,
                  email: true,
                  avatarUrl: true,
                },
              },
            },
          },
          user: {
            select: {
              id: true,
              fullName: true,
              email: true,
              avatarUrl: true,
            },
          },
          assignees: {
            include: {
              companyMember: {
                include: {
                  user: {
                    select: {
                      id: true,
                      fullName: true,
                      email: true,
                      avatarUrl: true,
                    },
                  },
                },
              },
            },
          },
          _count: {
            select: { comments: true, attachments: true, checklists: true },
          },
        },
        orderBy,
        take: limit,
        skip: skip,
      }),
    ]);

    const totalPage = Math.ceil(totalData / limit);

    return {
      data,
      meta: {
        currentPage: page,
        limit,
        totalData,
        totalPage,
      },
    };
  }

  public async getById(id: string, companyId: string | null, userId?: string, viewer?: TaskViewer) {
    const where: Record<string, unknown> = { id };
    if (companyId) {
      where.companyId = companyId;
    } else if (userId) {
      where.userId = userId;
    }

    const task = await prisma.task.findFirst({
      where: where as any,
      include: {
        status: true,
        priority: true,
        reporter: {
          include: {
            user: {
              select: {
                id: true,
                fullName: true,
                email: true,
                avatarUrl: true,
              },
            },
          },
        },
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
            avatarUrl: true,
          },
        },
        assignees: {
          include: {
            companyMember: {
              include: {
                user: {
                  select: {
                    id: true,
                    fullName: true,
                    email: true,
                    avatarUrl: true,
                  },
                },
              },
            },
          },
        },
        comments: {
          include: {
            companyMember: {
              include: {
                user: {
                  select: {
                    id: true,
                    fullName: true,
                    email: true,
                    avatarUrl: true,
                  },
                },
              },
            },
            user: {
              select: {
                id: true,
                fullName: true,
                email: true,
                avatarUrl: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
        attachments: {
          include: {
            uploader: {
              include: {
                user: { select: { id: true, fullName: true } },
              },
            },
            user: { select: { id: true, fullName: true } },
          },
        },
        checklists: {
          include: { items: true },
        },
        activities: {
          include: {
            companyMember: {
              include: {
                user: { select: { id: true, fullName: true } },
              },
            },
            user: { select: { id: true, fullName: true } },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (task && companyId && viewer?.companyRole !== 'Owner' && viewer?.companyMemberId) {
      const mine =
        task.reporterMemberId === viewer.companyMemberId ||
        task.assignees.some((a) => a.companyMemberId === viewer.companyMemberId);
      if (!mine) return null;
    }
    return task;
  }

  public async create(
    companyId: string | null,
    reporterMemberId: string | null,
    userId: string,
    input: PickCreateTask,
  ) {
    const task = await prisma.$transaction(async (tx) => {
      const newTask = await tx.task.create({
        data: {
          companyId: companyId ?? null,
          reporterMemberId: companyId ? (reporterMemberId ?? null) : null,
          userId: companyId ? null : userId,
          title: input.title,
          description: input.description ?? null,
          statusId: input.statusId,
          priorityId: input.priorityId ?? null,
          startDate: input.startDate ? new Date(input.startDate) : null,
          dueDate: input.dueDate ? new Date(input.dueDate) : null,
          estimatedMinutes: input.estimatedMinutes ?? null,
        },
      });

      if (companyId && input.assigneeIds && input.assigneeIds.length > 0) {
        await tx.taskAssignee.createMany({
          data: input.assigneeIds.map((memberId) => ({
            taskId: newTask.id,
            companyMemberId: memberId,
          })),
        });
      }

      await tx.taskActivity.create({
        data: {
          taskId: newTask.id,
          companyMemberId: companyId ? (reporterMemberId ?? null) : null,
          userId: companyId ? null : userId,
          action: 'Membuat tugas',
        },
      });

      return newTask;
    });

    return this.getById(task.id, companyId, userId);
  }

  public async update(
    id: string,
    companyId: string | null,
    userId: string,
    actorMemberId: string | null,
    input: PickUpdateTask,
    viewer?: TaskViewer,
  ) {
    const whereClause: Record<string, unknown> = companyId ? { id, companyId } : { id, userId };

    const existing = await prisma.task.findFirst({
      where: whereClause as any,
      include: { assignees: true },
    });
    if (!existing) return null;

    if (companyId && viewer?.companyRole !== 'Owner' && viewer?.companyMemberId) {
      const allowed =
        existing.reporterMemberId === viewer.companyMemberId ||
        existing.assignees.some((a) => a.companyMemberId === viewer.companyMemberId);
      if (!allowed) return null;
    }

    await prisma.$transaction(async (tx) => {
      await tx.task.update({
        where: { id },
        data: {
          ...(input.title !== undefined && { title: input.title }),
          ...(input.description !== undefined && {
            description: input.description,
          }),
          ...(input.statusId !== undefined && { statusId: input.statusId }),
          ...(input.priorityId !== undefined && {
            priorityId: input.priorityId,
          }),
          ...(input.startDate !== undefined && {
            startDate: input.startDate ? new Date(input.startDate) : null,
          }),
          ...(input.dueDate !== undefined && {
            dueDate: input.dueDate ? new Date(input.dueDate) : null,
          }),
          ...(input.estimatedMinutes !== undefined && {
            estimatedMinutes: input.estimatedMinutes,
          }),
        },
      });

      if (companyId && input.assigneeIds !== undefined) {
        await tx.taskAssignee.deleteMany({ where: { taskId: id } });
        if (input.assigneeIds.length > 0) {
          await tx.taskAssignee.createMany({
            data: input.assigneeIds.map((memberId) => ({
              taskId: id,
              companyMemberId: memberId,
            })),
          });
        }
      }

      await tx.taskActivity.create({
        data: {
          taskId: id,
          companyMemberId: companyId ? (actorMemberId ?? null) : null,
          userId: companyId ? null : userId,
          action: 'Memperbarui tugas',
        },
      });
    });

    return this.getById(id, companyId, userId, viewer);
  }

  public async remove(id: string, companyId: string | null, userId: string, viewer?: TaskViewer) {
    const whereClause: Record<string, unknown> = companyId ? { id, companyId } : { id, userId };

    const existing = await prisma.task.findFirst({
      where: whereClause as any,
      include: { assignees: true },
    });
    if (!existing) return null;

    if (companyId && viewer?.companyRole !== 'Owner' && viewer?.companyMemberId) {
      const allowed =
        existing.reporterMemberId === viewer.companyMemberId ||
        existing.assignees.some((a) => a.companyMemberId === viewer.companyMemberId);
      if (!allowed) return null;
    }

    await prisma.task.delete({ where: { id } });
    return existing;
  }

  public async assign(
    id: string,
    companyId: string | null,
    userId: string,
    actorMemberId: string | null,
    assigneeIds: string[],
    viewer?: TaskViewer,
  ) {
    const whereClause: Record<string, unknown> = companyId ? { id, companyId } : { id, userId };

    const existing = await prisma.task.findFirst({
      where: whereClause as any,
      include: { assignees: true },
    });
    if (!existing) return null;

    if (companyId && viewer?.companyRole !== 'Owner' && viewer?.companyMemberId) {
      const allowed =
        existing.reporterMemberId === viewer.companyMemberId ||
        existing.assignees.some((a) => a.companyMemberId === viewer.companyMemberId);
      if (!allowed) return null;
    }

    if (!companyId) {
      return this.getById(id, companyId, userId, viewer);
    }

    await prisma.$transaction([
      prisma.taskAssignee.deleteMany({ where: { taskId: id } }),
      prisma.taskAssignee.createMany({
        data: assigneeIds.map((memberId) => ({
          taskId: id,
          companyMemberId: memberId,
        })),
        skipDuplicates: true,
      }),
      prisma.taskActivity.create({
        data: {
          taskId: id,
          companyMemberId: actorMemberId ?? null,
          action: `Mengatur penugasan kepada ${assigneeIds.length} anggota`,
        },
      }),
    ]);

    return this.getById(id, companyId, userId, viewer);
  }

  public async updateStatus(
    id: string,
    companyId: string | null,
    userId: string,
    actorMemberId: string | null,
    statusId: string,
    viewer?: TaskViewer,
  ) {
    const whereClause: Record<string, unknown> = companyId ? { id, companyId } : { id, userId };

    const existing = await prisma.task.findFirst({
      where: whereClause as any,
      include: { assignees: true },
    });
    if (!existing) return null;

    if (companyId && viewer?.companyRole !== 'Owner' && viewer?.companyMemberId) {
      const allowed =
        existing.reporterMemberId === viewer.companyMemberId ||
        existing.assignees.some((a) => a.companyMemberId === viewer.companyMemberId);
      if (!allowed) return null;
    }

    const statusObj = await prisma.taskStatus.findUnique({
      where: { id: statusId },
    });

    await prisma.$transaction([
      prisma.task.update({
        where: { id },
        data: {
          statusId,
          completedAt: statusObj?.name.toLowerCase().includes('complete') ? new Date() : null,
        },
      }),
      prisma.taskActivity.create({
        data: {
          taskId: id,
          companyMemberId: companyId ? (actorMemberId ?? null) : null,
          userId: companyId ? null : userId,
          action: `Mengubah status menjadi ${statusObj?.name ?? statusId}`,
        },
      }),
    ]);

    return this.getById(id, companyId, userId, viewer);
  }

  public async addComment(
    id: string,
    companyId: string | null,
    userId: string,
    actorMemberId: string | null,
    content: string,
  ) {
    const whereClause: Record<string, unknown> = companyId ? { id, companyId } : { id, userId };

    const existing = await prisma.task.findFirst({ where: whereClause as any });
    if (!existing) return null;

    const comment = await prisma.$transaction(async (tx) => {
      const newComment = await tx.taskComment.create({
        data: {
          taskId: id,
          companyMemberId: companyId ? (actorMemberId ?? null) : null,
          userId: companyId ? null : userId,
          content,
        },
        include: {
          companyMember: {
            include: {
              user: {
                select: {
                  id: true,
                  fullName: true,
                  email: true,
                  avatarUrl: true,
                },
              },
            },
          },
          user: {
            select: {
              id: true,
              fullName: true,
              email: true,
              avatarUrl: true,
            },
          },
        },
      });

      await tx.taskActivity.create({
        data: {
          taskId: id,
          companyMemberId: companyId ? (actorMemberId ?? null) : null,
          userId: companyId ? null : userId,
          action: 'Menambahkan komentar',
        },
      });

      return newComment;
    });

    return comment;
  }

  public async createChecklist(
    id: string,
    companyId: string | null,
    userId: string,
    actorMemberId: string | null,
    input: PickCreateTaskChecklist,
  ) {
    const whereClause: Record<string, unknown> = companyId ? { id, companyId } : { id, userId };

    const existing = await prisma.task.findFirst({ where: whereClause as any });
    if (!existing) return null;

    const checklist = await prisma.$transaction(async (tx) => {
      const newChecklist = await tx.taskChecklist.create({
        data: {
          taskId: id,
          title: input.title,
        },
      });

      if (input.items && input.items.length > 0) {
        await tx.taskChecklistItem.createMany({
          data: input.items.map((itemContent) => ({
            checklistId: newChecklist.id,
            content: itemContent,
          })),
        });
      }

      await tx.taskActivity.create({
        data: {
          taskId: id,
          companyMemberId: companyId ? (actorMemberId ?? null) : null,
          userId: companyId ? null : userId,
          action: `Membuat checklist: ${input.title}`,
        },
      });

      return tx.taskChecklist.findUnique({
        where: { id: newChecklist.id },
        include: { items: true },
      });
    });

    return checklist;
  }

  public async addAttachment(
    id: string,
    companyId: string | null,
    userId: string,
    actorMemberId: string | null,
    input: PickAddTaskAttachment,
  ) {
    const whereClause: Record<string, unknown> = companyId ? { id, companyId } : { id, userId };

    const existing = await prisma.task.findFirst({ where: whereClause as any });
    if (!existing) return null;

    const attachment = await prisma.$transaction(async (tx) => {
      const newAttachment = await tx.taskAttachment.create({
        data: {
          taskId: id,
          uploadedBy: companyId ? (actorMemberId ?? null) : null,
          userId: companyId ? null : userId,
          fileName: input.fileName,
          fileUrl: input.fileUrl,
          fileSize: BigInt(input.fileSize),
        },
        include: {
          uploader: {
            include: {
              user: { select: { id: true, fullName: true } },
            },
          },
          user: { select: { id: true, fullName: true } },
        },
      });

      await tx.taskActivity.create({
        data: {
          taskId: id,
          companyMemberId: companyId ? (actorMemberId ?? null) : null,
          userId: companyId ? null : userId,
          action: `Mengunggah lampiran: ${input.fileName}`,
        },
      });

      return {
        ...newAttachment,
        fileSize: Number(newAttachment.fileSize),
      };
    });

    return attachment;
  }

  public async listActivities(
    id: string,
    companyId: string | null,
    userId: string,
    page = 1,
    limit = 10,
  ) {
    const whereClause: Record<string, unknown> = companyId ? { id, companyId } : { id, userId };

    const existing = await prisma.task.findFirst({ where: whereClause as any });
    if (!existing) return null;

    const skip = (page - 1) * limit;
    const [totalData, data] = await prisma.$transaction([
      prisma.taskActivity.count({
        where: { taskId: id },
      }),
      prisma.taskActivity.findMany({
        where: { taskId: id },
        include: {
          companyMember: {
            include: {
              user: { select: { id: true, fullName: true, avatarUrl: true } },
            },
          },
          user: { select: { id: true, fullName: true, avatarUrl: true } },
        },
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: skip,
      }),
    ]);

    const totalPage = Math.ceil(totalData / limit);

    return {
      data,
      meta: {
        currentPage: page,
        limit,
        totalData,
        totalPage,
      },
    };
  }
}

export default new TaskService();
