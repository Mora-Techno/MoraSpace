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
