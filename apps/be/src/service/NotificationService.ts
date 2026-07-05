import { randomUUID } from 'node:crypto';
import nodemailer from 'nodemailer';
import type { NotificationStatus } from '@repo/types/notification.types';
import type { NotificationLogQuery, PickSendNotification } from '@repo/types/notification.types';

class NotificationService {
  private createTransporter() {
    const host = process.env.SMTP_HOST;
    const port = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : 587;
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;
    const secure = process.env.SMTP_SECURE === 'true';

    if (!host || !user || !pass) {
      throw new Error('Konfigurasi SMTP belum lengkap');
    }

    return nodemailer.createTransport({
      host,
      port,
      secure,
      auth: { user, pass },
    });
  }

  public async send(input: PickSendNotification) {
    let status: NotificationStatus = 'success';
    let errorMessage: string | null = null;

    try {
      const transporter = this.createTransporter();
      await transporter.sendMail({
        from: process.env.SMTP_USER,
        to: input.recipient,
        subject: input.subject,
        text: input.body,
        html: `<p>${input.body.replace(/\n/g, '<br>')}</p>`,
      });
    } catch (error) {
      status = 'failed';
      errorMessage = error instanceof Error ? error.message : 'Gagal mengirim email';
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

    if (status === 'failed') {
      throw new Error(errorMessage ?? 'Gagal mengirim email');
    }

    return log;
  }

  public async listLogs(_query: NotificationLogQuery) {
    return [];
  }
}

export default new NotificationService();
