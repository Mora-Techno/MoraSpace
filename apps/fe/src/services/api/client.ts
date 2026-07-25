import { getCookie } from "cookies-next";

import { env } from "@/configs";
import { APP_SESSION_COOKIE_KEY } from "@/configs";
import { loadAuthSession } from "@/utils/storage";
import type { TErrorResponse, TResponse } from "@/types/api/response";

const BASE_URL = env.NEXT_PUBLIC_BACKEND_URL;

function getAuthHeaders(): Record<string, string> {
  const internalApiKey =
    env.NEXT_PUBLIC_INTERNAL_API_SECRET ||
    env.NEXT_INTERNAL_API_SECRET ||
    process.env.INTERNAL_API_SECRET ||
    process.env.INTERNAL_API_KEY ||
    "";

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "x-internal-api-key": internalApiKey,
  };

  const sessionToken = loadAuthSession()?.accessToken;
  if (sessionToken) {
    headers.Authorization = `Bearer ${sessionToken}`;
    return headers;
  }

  const token = getCookie(APP_SESSION_COOKIE_KEY);
  if (typeof token === "string" && token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
}

type QueryParams = Record<string, string | number | undefined | null>;

function buildQuery(params?: QueryParams): string {
  if (!params) return "";

  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      search.set(key, String(value));
    }
  });

  const query = search.toString();
  return query ? `?${query}` : "";
}

async function parseResponse<T>(res: Response): Promise<TResponse<T>> {
  const json = (await res.json()) as TResponse<T> | TErrorResponse;

  if (!res.ok) {
    throw new Error(json.message ?? "Request gagal");
  }

  return json as TResponse<T>;
}

export async function apiGet<T>(
  path: string,
  params?: QueryParams,
): Promise<TResponse<T>> {
  const res = await fetch(`${BASE_URL}${path}${buildQuery(params)}`, {
    method: "GET",
    headers: getAuthHeaders(),
    cache: "no-store",
  });

  return parseResponse<T>(res);
}

export async function apiPost<T>(
  path: string,
  body?: unknown,
): Promise<TResponse<T>> {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: body !== undefined ? JSON.stringify(body) : undefined,
    cache: "no-store",
  });

  return parseResponse<T>(res);
}

export async function apiPut<T>(
  path: string,
  body?: unknown,
): Promise<TResponse<T>> {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: body !== undefined ? JSON.stringify(body) : undefined,
    cache: "no-store",
  });

  return parseResponse<T>(res);
}

export async function apiPatch<T>(
  path: string,
  body?: unknown,
): Promise<TResponse<T>> {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: "PATCH",
    headers: getAuthHeaders(),
    body: body !== undefined ? JSON.stringify(body) : undefined,
    cache: "no-store",
  });

  return parseResponse<T>(res);
}

export async function apiDelete<T>(path: string): Promise<TResponse<T>> {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
    cache: "no-store",
  });

  return parseResponse<T>(res);
}
