/**
 * Kontrak API untuk fitur settings — berdasarkan model Prisma `UserSetting`.
 * Setiap user (company member) memiliki pengaturan yang berbeda-beda,
 * sehingga endpoint settings selalu di-scope berdasarkan companyMemberId.
 */
export type ThemePreference = "light" | "dark" | "system";

export interface ISettings {
  id: string;
  theme: string | null;
  language: string | null;
  timezone: string | null;
  enableMusic: boolean;
  focusMode: boolean;
  notificationEnabled: boolean;
}

export type Settings = Pick<
  ISettings,
  | "id"
  | "theme"
  | "language"
  | "timezone"
  | "enableMusic"
  | "focusMode"
  | "notificationEnabled"
>;

export type PickUpdateSettings = Partial<
  Pick<
    ISettings,
    | "theme"
    | "language"
    | "timezone"
    | "enableMusic"
    | "focusMode"
    | "notificationEnabled"
  >
>;

export interface TestEmail {
  email: string;
}
