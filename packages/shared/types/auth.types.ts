import type { CompanyRole } from "./company.types";

export interface IAuth {
  id: string;
  email: string;
  phone?: string | null;
  fullName: string;
  password: string;
  token?: string | null;
  refreshToken?: string | null;
  refreshTokenExpiresAt?: Date | null;
  magicLinkToken?: string | null;
  magicLinkExpiresAt?: Date | null;
  companyRole: CompanyRole;
  companyId?: string | null;
  otp?: string | null;
  expOtp?: Date | null;
  isVerify?: boolean | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export type SafeAuthUser = Pick<
  IAuth,
  | "id"
  | "email"
  | "phone"
  | "fullName"
  | "companyRole"
  | "companyId"
  | "isVerify"
  | "createdAt"
  | "updatedAt"
> & {
  companyMemberId?: string | null;
};

export interface AuthTokensResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: string;
}

export type AccessTokenPayload = Pick<
  IAuth,
  "id" | "email" | "companyRole" | "fullName" | "companyId"
> & {
  tokenType?: "access";
  companyMemberId?: string | null;
};

export interface AuthSessionResponse extends AuthTokensResponse {
  user: SafeAuthUser;
}

export type JwtPayload = AccessTokenPayload;

export type PickLogin = Pick<IAuth, "email" | "password">;
export type PickRegister = Pick<
  IAuth,
  "email" | "fullName" | "password" | "companyRole" | "phone"
>;
export type PickRefreshToken = Pick<IAuth, "refreshToken">;
export type PickSendMagicLink = Pick<IAuth, "email">;
export type PickVerifyMagicLink = { token: string };
export type PickSendOtp = Partial<Pick<IAuth, "email" | "phone">>;
export type PickVerifyOtp = Partial<Pick<IAuth, "email" | "phone">> &
  Pick<IAuth, "otp">;
export type PickCreateAdmin = Pick<IAuth, "email" | "fullName" | "password">;
export type PickLogout = Pick<IAuth, "id">;
export type PickResetPassword = Pick<IAuth, "email" | "phone">;
