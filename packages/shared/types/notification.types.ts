export type NotificationStatus = "success" | "failed";

/** Mirror Prisma model `Notification` (in-app) */
export interface INotification {
  id: string;
  title: string;
  body: string;
  type: string;
  readAt: Date | null;
  createdAt: Date;
}

export type NotificationInApp = Pick<
  INotification,
  "id" | "title" | "body" | "type"
> & {
  readAt: string | null;
  createdAt: string;
};

/** Mirror Prisma model `NotificationLog` */
export interface INotificationLog {
  id: string;
  recipient: string;
  subject: string;
  body: string;
  status: NotificationStatus;
  error: string | null;
  createdAt: Date;
}

export type NotificationLog = Pick<
  INotificationLog,
  "id" | "recipient" | "subject" | "body" | "status" | "error"
> & {
  createdAt: string;
};

export type NotificationLogQuery = {
  search?: string;
  status?: NotificationStatus;
  page?: number;
  limit?: number;
  type?: string;
  startDate?: string;
  endDate?: string;
};

export type NotificationInAppQuery = {
  search?: string;
  page?: number;
  limit?: number;
  read?: "true" | "false";
  type?: string;
  startDate?: string;
  endDate?: string;
};

export type NotificationQueueQuery = {
  page?: number;
  limit?: number;
  status?: "pending" | "processing" | "failed";
};

export type PickSendNotification = Pick<
  INotificationLog,
  "recipient" | "subject" | "body"
>;
