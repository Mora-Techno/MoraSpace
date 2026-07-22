import { randomUUID } from "node:crypto";
import nodemailer from "nodemailer";
import prisma from "prisma/client";
import type { NotificationStatus } from "@repo/types/notification.types";
import type {
  NotificationLogQuery,
  PickSendNotification,
} from "@repo/types/notification.types";

class NotificationService {
  private createTransporter() {
    const host = process.env.SMTP_HOST;
    const port = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : 587;
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;
    const secure = process.env.SMTP_SECURE === "true";

    if (!host || !user || !pass) {
      throw new Error("Konfigurasi SMTP belum lengkap");
    }

    return nodemailer.createTransport({
      host,
      port,
      secure,
      auth: { user, pass },
    });
  }

  public async send(input: PickSendNotification) {
    let status: NotificationStatus = "success";
    let errorMessage: string | null = null;

    try {
      const transporter = this.createTransporter();
      await transporter.sendMail({
        from: process.env.SMTP_USER,
        to: input.recipient,
        subject: input.subject,
        text: input.body,
        html: `<p>${input.body.replace(/\n/g, "<br>")}</p>`,
      });
    } catch (error) {
      status = "failed";
      errorMessage =
        error instanceof Error ? error.message : "Gagal mengirim email";
    }

    const log = {
      id: randomUUID(),
      recipient: input.recipient,
      subject: input.subject,
      body: input.body,
      status,
      error: errorMessage,
      createdAt: new Date(),
    };

    if (status === "failed") {
      throw new Error(errorMessage ?? "Gagal mengirim email");
    }

    return log;
  }

  public async listLogs(
    query: NotificationLogQuery & {
      search?: string;
      type?: string;
      startDate?: string;
      endDate?: string;
      page?: number;
      limit?: number;
    } = {},
  ) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};

    if (query.search) {
      where.OR = [
        { recipient: { contains: query.search, mode: "insensitive" } },
        { subject: { contains: query.search, mode: "insensitive" } },
      ];
    }

    if (query.status) {
      where.status = query.status;
    }

    if (query.type) {
      where.type = query.type;
    }

    if (query.startDate || query.endDate) {
      where.createdAt = {};
      if (query.startDate)
        (where.createdAt as Record<string, unknown>).gte = new Date(
          query.startDate,
        );
      if (query.endDate)
        (where.createdAt as Record<string, unknown>).lte = new Date(
          query.endDate,
        );
    }

    const [totalData, data] = await prisma.$transaction([
      prisma.notificationLog.count({ where: where as any }),
      prisma.notificationLog.findMany({
        where: where as any,
        orderBy: { createdAt: "desc" },
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

  public async listInApp(
    companyMemberId: string,
    query: {
      search?: string;
      read?: "true" | "false";
      type?: string;
      startDate?: string;
      endDate?: string;
      page?: number;
      limit?: number;
    } = {},
  ) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = { companyMemberId };

    if (query.search) {
      where.message = { contains: query.search, mode: "insensitive" };
    }

    if (query.read === "true") {
      where.readAt = { not: null };
    } else if (query.read === "false") {
      where.readAt = null;
    }

    if (query.type) {
      where.type = query.type;
    }

    if (query.startDate || query.endDate) {
      where.createdAt = {};
      if (query.startDate)
        (where.createdAt as Record<string, unknown>).gte = new Date(
          query.startDate,
        );
      if (query.endDate)
        (where.createdAt as Record<string, unknown>).lte = new Date(
          query.endDate,
        );
    }

    const [totalData, data] = await prisma.$transaction([
      prisma.notification.count({ where: where as any }),
      prisma.notification.findMany({
        where: where as any,
        orderBy: { createdAt: "desc" },
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

  public async listQueue(
    query: {
      status?: "pending" | "processing" | "failed";
      page?: number;
      limit?: number;
    } = {},
  ) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};

    if (query.status) {
      where.status = query.status;
    }

    const [totalData, data] = await prisma.$transaction([
      prisma.notificationQueue.count({ where: where as any }),
      prisma.notificationQueue.findMany({
        where: where as any,
        include: { notification: true },
        orderBy: { scheduledAt: "asc" },
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

  public async markRead(id: string, companyMemberId: string) {
    const existing = await prisma.notification.findFirst({
      where: { id, companyMemberId },
    });
    if (!existing) return null;

    const updated = await prisma.notification.update({
      where: { id },
      data: { readAt: new Date() },
    });
    return updated;
  }

  public async markAllRead(companyMemberId: string) {
    await prisma.notification.updateMany({
      where: { companyMemberId, readAt: null },
      data: { readAt: new Date() },
    });
    return { success: true };
  }
}

export default new NotificationService();
