export interface ISession {
  id: string;
  userId: string;
  deviceName: string;
  browser: string;
  ipAddress: string;
  accessToken: string;
  expiredAt: string;
  createdAt: string;
}

export type SessionQuery = {
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  device?: string;
  startDate?: string;
  endDate?: string;
};

// type
export type Session = Pick<
  ISession,
  | "ipAddress"
  | "browser"
  | "accessToken"
  | "createdAt"
  | "deviceName"
  | "expiredAt"
  | "id"
>;
