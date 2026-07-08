import prisma from 'prisma/client';
import type {
  PickCreateTask,
  PickUpdateTask,
  PickCreateTaskChecklist,
  PickAddTaskAttachment,
} from '@repo/types/task.types';

class TaskService {
  public async list(companyId: string, page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const [totalData, data] = await prisma.$transaction([
      prisma.task.count({
        where: { companyId },
      }),
      prisma.task.findMany({
        where: { companyId },
        include: {
          status: true,
          priority: true,
          reporter: {
            include: {
              user: { select: { id: true, fullName: true, email: true, avatarUrl: true } },
            },
          },
          assignees: {
            include: {
              companyMember: {
                include: {
                  user: { select: { id: true, fullName: true, email: true, avatarUrl: true } },
                },
              },
            },
          },
          _count: {
            select: { comments: true, attachments: true, checklists: true },
          },
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

  public async getById(id: string, companyId: string) {
    const task = await prisma.task.findFirst({
      where: { id, companyId },
      include: {
        status: true,
        priority: true,
        reporter: {
          include: {
            user: { select: { id: true, fullName: true, email: true, avatarUrl: true } },
          },
        },
        assignees: {
          include: {
            companyMember: {
              include: {
                user: { select: { id: true, fullName: true, email: true, avatarUrl: true } },
              },
            },
          },
        },
        comments: {
          include: {
            companyMember: {
              include: {
                user: { select: { id: true, fullName: true, email: true, avatarUrl: true } },
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
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });
    return task;
  }

  public async create(companyId: string, reporterMemberId: string, input: PickCreateTask) {
    const task = await prisma.$transaction(async (tx) => {
      const newTask = await tx.task.create({
        data: {
          companyId,
          reporterMemberId,
          title: input.title,
          description: input.description ?? null,
          statusId: input.statusId,
          priorityId: input.priorityId ?? null,
          startDate: input.startDate ? new Date(input.startDate) : null,
          dueDate: input.dueDate ? new Date(input.dueDate) : null,
          estimatedMinutes: input.estimatedMinutes ?? null,
        },
      });

      if (input.assigneeIds && input.assigneeIds.length > 0) {
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
          companyMemberId: reporterMemberId,
          action: 'Membuat tugas',
        },
      });

      return newTask;
    });

    return this.getById(task.id, companyId);
  }

  public async update(id: string, companyId: string, actorMemberId: string, input: PickUpdateTask) {
    const existing = await prisma.task.findFirst({ where: { id, companyId } });
    if (!existing) return null;

    await prisma.$transaction(async (tx) => {
      await tx.task.update({
        where: { id },
        data: {
          ...(input.title !== undefined && { title: input.title }),
          ...(input.description !== undefined && { description: input.description }),
          ...(input.statusId !== undefined && { statusId: input.statusId }),
          ...(input.priorityId !== undefined && { priorityId: input.priorityId }),
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

      if (input.assigneeIds !== undefined) {
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
          companyMemberId: actorMemberId,
          action: 'Memperbarui tugas',
        },
      });
    });

    return this.getById(id, companyId);
  }

  public async remove(id: string, companyId: string) {
    const existing = await prisma.task.findFirst({ where: { id, companyId } });
    if (!existing) return null;

    await prisma.task.delete({ where: { id } });
    return existing;
  }

  public async assign(id: string, companyId: string, actorMemberId: string, assigneeIds: string[]) {
    const existing = await prisma.task.findFirst({ where: { id, companyId } });
    if (!existing) return null;

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
          companyMemberId: actorMemberId,
          action: `Mengatur penugasan kepada ${assigneeIds.length} anggota`,
        },
      }),
    ]);

    return this.getById(id, companyId);
  }

  public async updateStatus(id: string, companyId: string, actorMemberId: string, statusId: string) {
    const existing = await prisma.task.findFirst({ where: { id, companyId } });
    if (!existing) return null;

    const statusObj = await prisma.taskStatus.findUnique({ where: { id: statusId } });

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
          companyMemberId: actorMemberId,
          action: `Mengubah status menjadi ${statusObj?.name ?? statusId}`,
        },
      }),
    ]);

    return this.getById(id, companyId);
  }

  public async addComment(id: string, companyId: string, actorMemberId: string, content: string) {
    const existing = await prisma.task.findFirst({ where: { id, companyId } });
    if (!existing) return null;

    const comment = await prisma.$transaction(async (tx) => {
      const newComment = await tx.taskComment.create({
        data: {
          taskId: id,
          companyMemberId: actorMemberId,
          content,
        },
        include: {
          companyMember: {
            include: {
              user: { select: { id: true, fullName: true, email: true, avatarUrl: true } },
            },
          },
        },
      });

      await tx.taskActivity.create({
        data: {
          taskId: id,
          companyMemberId: actorMemberId,
          action: 'Menambahkan komentar',
        },
      });

      return newComment;
    });

    return comment;
  }

  public async createChecklist(
    id: string,
    companyId: string,
    actorMemberId: string,
    input: PickCreateTaskChecklist,
  ) {
    const existing = await prisma.task.findFirst({ where: { id, companyId } });
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
          companyMemberId: actorMemberId,
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
    companyId: string,
    actorMemberId: string,
    input: PickAddTaskAttachment,
  ) {
    const existing = await prisma.task.findFirst({ where: { id, companyId } });
    if (!existing) return null;

    const attachment = await prisma.$transaction(async (tx) => {
      const newAttachment = await tx.taskAttachment.create({
        data: {
          taskId: id,
          uploadedBy: actorMemberId,
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
        },
      });

      await tx.taskActivity.create({
        data: {
          taskId: id,
          companyMemberId: actorMemberId,
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

  public async listActivities(id: string, companyId: string, page = 1, limit = 10) {
    const existing = await prisma.task.findFirst({ where: { id, companyId } });
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
