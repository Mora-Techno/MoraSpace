const STORAGE_KEY = "mora-space-auth-session";

export type AuthSession = {
  accessToken?: string;
  refreshToken: string;
  role?: string;
  updatedAt: number;
};

export function persistAuthSession(
  session: Pick<AuthSession, "accessToken" | "refreshToken" | "role">,
) {
  if (typeof window === "undefined") return;

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      ...session,
      updatedAt: Date.now(),
    }),
  );
}

export function loadAuthSession(): AuthSession | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as AuthSession;
    if (!parsed?.refreshToken) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}

export function clearAuthSession() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
}

export function persistAuthSessionFromResponse(data: unknown) {
  if (!data || typeof data !== "object") return;

  const record = data as Record<string, unknown>;
  const tokens =
    record.tokens && typeof record.tokens === "object"
      ? (record.tokens as Record<string, unknown>)
      : null;
  const user =
    record.user && typeof record.user === "object"
      ? (record.user as Record<string, unknown>)
      : null;

  const refreshToken =
    (typeof tokens?.refreshToken === "string" ? tokens.refreshToken : null) ??
    (typeof record.refreshToken === "string" ? record.refreshToken : null) ??
    (typeof user?.refreshToken === "string" ? user.refreshToken : null);

  const accessToken =
    (typeof tokens?.accessToken === "string" ? tokens.accessToken : null) ??
    (typeof record.accessToken === "string" ? record.accessToken : null) ??
    (typeof user?.accessToken === "string" ? user.accessToken : null);

  const role =
    (typeof user?.companyRole === "string" ? user.companyRole : null) ??
    (typeof user?.role === "string" ? user.role : null) ??
    (typeof record.companyRole === "string" ? record.companyRole : null) ??
    (typeof record.role === "string" ? record.role : null);

  if (!refreshToken) return;

  persistAuthSession({
    accessToken: accessToken ?? undefined,
    refreshToken,
    role: role ?? undefined,
  });
}

export function syncAuthFromRefreshResponse(
  data: unknown,
  fallback?: AuthSession | null,
) {
  if (!data || typeof data !== "object") {
    if (fallback?.refreshToken) {
      persistAuthSession({
        accessToken: fallback.accessToken,
        refreshToken: fallback.refreshToken,
        role: fallback.role,
      });
    }
    return;
  }

  persistAuthSessionFromResponse(data);
}
