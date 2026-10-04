import {
  APP_SESSION_COOKIE_KEY,
  APP_SESSION_COOKIE_REFRESH,
  AUTH_COOKIE_MAX_AGE,
} from '@repo/config/cookies.config';
import { api, joinUrl, version } from '@repo/config/repo.config';
import type { ApiSuccessResponse } from '@repo/types/api.types';
import { cookies } from 'next/headers';

import { env } from '@/configs';

import { type AuthTokens, saveTokens } from './auth-cookie';

const COOKIE_KEYS = {
  accessToken: APP_SESSION_COOKIE_KEY,
  refreshToken: APP_SESSION_COOKIE_REFRESH,
} as const;

type RefreshPayload = {
  tokens?: {
    accessToken?: string;
    refreshToken?: string;
  };
  user?: {
    role?: string;
  };
};

export type RefreshAuthSessionResult = { ok: true; tokens: AuthTokens } | { ok: false };

function extractRefreshPayload(payload?: RefreshPayload | null): AuthTokens | null {
  const accessToken = payload?.tokens?.accessToken;
  const refreshToken = payload?.tokens?.refreshToken;

  if (!accessToken || !refreshToken) {
    return null;
  }

  return {
    accessToken,
    refreshToken,
    role: payload?.user?.role,
  };
}

export async function refreshAuthSession(refreshToken: string): Promise<RefreshAuthSessionResult> {
  const baseUrl = env.NEXT_PUBLIC_BACKEND_URL;
  if (!baseUrl) throw new Error('NEXT_PUBLIC_BACKEND_URL is not defined');
  const internalApiKey =
    env.NEXT_INTERNAL_API_SECRET ||
    process.env.INTERNAL_API_SECRET ||
    process.env.INTERNAL_API_KEY ||
    '';

  let response: Response;
  try {
    response = await fetch(`${joinUrl(baseUrl, api, version)}/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-internal-api-key': internalApiKey,
      },
      body: JSON.stringify({ refreshToken }),
      cache: 'no-store',
    });
  } catch {
    return { ok: false };
  }

  if (!response.ok) {
    return { ok: false };
  }

  let payload: RefreshPayload | null;
  try {
    const json = (await response.json()) as ApiSuccessResponse<RefreshPayload>;
    payload = json.data ?? null;
  } catch {
    return { ok: false };
  }

  const tokens = extractRefreshPayload(payload);
  if (!tokens) {
    return { ok: false };
  }

  await saveTokens(tokens);
  return { ok: true, tokens };
}

export async function getStoredRefreshToken(): Promise<string | undefined> {
  const store = await cookies();
  return store.get(COOKIE_KEYS.refreshToken)?.value;
}

export async function hasAccessToken(): Promise<boolean> {
  const store = await cookies();
  return Boolean(store.get(COOKIE_KEYS.accessToken)?.value);
}

export async function ensureAuthenticatedSession(refreshTokenOverride?: string): Promise<boolean> {
  if (await hasAccessToken()) {
    return true;
  }

  const refreshToken = refreshTokenOverride ?? (await getStoredRefreshToken());
  if (!refreshToken) {
    return false;
  }

  const result = await refreshAuthSession(refreshToken);
  return result.ok;
}

export { AUTH_COOKIE_MAX_AGE };
