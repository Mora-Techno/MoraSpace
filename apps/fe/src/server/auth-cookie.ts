"use server";
import {
  APP_SESSION_COOKIE_KEY,
  APP_SESSION_COOKIE_REFRESH,
  APP_SESSION_COOKIE_ROLE,
  AUTH_COOKIE_MAX_AGE,
} from "@repo/config/cookies.config";
import { cookies } from "next/headers";

const COOKIE_KEYS = {
  accessToken: APP_SESSION_COOKIE_KEY,
  refreshToken: APP_SESSION_COOKIE_REFRESH,
  role: APP_SESSION_COOKIE_ROLE,
} as const;

const COOKIE_TTL = AUTH_COOKIE_MAX_AGE;

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

export interface AuthTokens extends TokenPair {
  role?: string;
}

export async function getCookieStore() {
  return await cookies();
}

export async function saveTokens(tokens: AuthTokens): Promise<void> {
  const store = await getCookieStore();
  const isProduction = process.env.NODE_ENV === "production";

  try {
    store.set(COOKIE_KEYS.accessToken, tokens.accessToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: "lax",
      path: "/",
      maxAge: COOKIE_TTL.accessToken,
    });

    store.set(COOKIE_KEYS.refreshToken, tokens.refreshToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: "lax",
      path: "/",
      maxAge: COOKIE_TTL.refreshToken,
    });

    if (tokens.role) {
      store.set(COOKIE_KEYS.role, tokens.role, {
        httpOnly: true,
        secure: isProduction,
        sameSite: "lax",
        path: "/",
        maxAge: COOKIE_TTL.role,
      });
    }
  } catch (err) {
    console.error("[Auth] saveTokens: gagal menyimpan cookie:", err);
    throw err;
  }
}

export async function clearTokens(): Promise<void> {
  const store = await getCookieStore();
  store.delete(COOKIE_KEYS.accessToken);
  store.delete(COOKIE_KEYS.refreshToken);
  store.delete(COOKIE_KEYS.role);
}

export async function getRoleFromCookie(): Promise<string | undefined> {
  const store = await getCookieStore();
  return store.get(COOKIE_KEYS.role)?.value;
}
