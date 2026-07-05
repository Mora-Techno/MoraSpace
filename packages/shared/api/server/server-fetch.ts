import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Logger } from "../../utils/log";
import {
  ApiError as ApiErrorClass,
  type ApiSuccessResponse as ApiResponse,
} from "../../types/api.types";
import { api, joinUrl, version, baseurl } from "../../config/repo.config";
import {
  APP_SESSION_COOKIE_KEY,
  APP_SESSION_COOKIE_REFRESH,
} from "../../config/cookies.config";

const BASE_URL = baseurl;

const COOKIE_KEYS = {
  accessToken: APP_SESSION_COOKIE_KEY,
  refreshToken: APP_SESSION_COOKIE_REFRESH,
} as const;

export interface RequestConfig {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  headers?: Record<string, string>;
  cache?: RequestCache;
  next?: NextFetchRequestConfig;
}

type UnauthorizedMode = "redirect" | "json401";

type FetchOptions = {
  withAuth: boolean;
  unauthorizedMode?: UnauthorizedMode;
};

const IS_API_DEBUG = process.env.NODE_ENV === "development";

async function getAccessToken(): Promise<string | undefined> {
  const store = await cookies();
  return store.get(COOKIE_KEYS.accessToken)?.value;
}

async function getRefreshToken(): Promise<string | undefined> {
  const store = await cookies();
  return store.get(COOKIE_KEYS.refreshToken)?.value;
}

async function clearTokens(): Promise<void> {
  const store = await cookies();
  store.delete(COOKIE_KEYS.accessToken);
  store.delete(COOKIE_KEYS.refreshToken);
}

function buildBaseHeaders(accessToken?: string): Record<string, string> {
  const internalApiKey =
    process.env.NEXT_INTERNAL_API_SECRET ||
    process.env.INTERNAL_API_SECRET ||
    process.env.INTERNAL_API_KEY ||
    "";

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "x-internal-api-key": internalApiKey,
  };

  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`;
  }

  return headers;
}

function logApiRequest(params: {
  method: string;
  endpoint: string;
  headers: Record<string, string>;
  payload?: unknown;
}): void {
  Logger.request(
    params.method,
    params.endpoint,
    params.headers,
    params.payload,
  );
}

function logApiResponse(params: {
  method: string;
  endpoint: string;
  status: number;
  response: unknown;
}): void {
  Logger.response(
    params.method,
    params.endpoint,
    params.status,
    params.response,
  );
}

let _refreshInFlight: Promise<string | null> | null = null;

async function _doRefreshOnce(): Promise<string | null> {
  const refreshToken = await getRefreshToken();

  if (!refreshToken) {
    return null;
  }

  let res: Response;
  try {
    res = await fetch(`${joinUrl(BASE_URL, api, version)}/auth/refresh`, {
      method: "POST",
      headers: buildBaseHeaders(),
      body: JSON.stringify({ refreshToken }),
      cache: "no-store",
    });
  } catch {
    return null;
  }

  if (!res.ok) {
    return null;
  }

  let newTokens: { accessToken?: string; refreshToken?: string; role?: string };
  try {
    const json: ApiResponse<{
      tokens: { accessToken: string; refreshToken: string; role?: string };
    }> = await res.json();
    newTokens = json.data?.tokens ?? {};
  } catch {
    return null;
  }

  if (!newTokens.accessToken || !newTokens.refreshToken) {
    return null;
  }

  try {
    const store = await cookies();
    const isProduction = process.env.NODE_ENV === "production";

    store.set(COOKIE_KEYS.accessToken, newTokens.accessToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 15,
    });

    store.set(COOKIE_KEYS.refreshToken, newTokens.refreshToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });
  } catch (err) {
    if (IS_API_DEBUG) {
      console.error("[Auth] refresh: gagal menyimpan cookie", err);
    }
  }

  return newTokens.accessToken;
}

async function doRefreshToken(): Promise<string | null> {
  if (_refreshInFlight) {
    return _refreshInFlight;
  }

  _refreshInFlight = _doRefreshOnce().finally(() => {
    _refreshInFlight = null;
  });

  return _refreshInFlight;
}

async function handleUnauthorized(unauthorizedMode: UnauthorizedMode) {
  await clearTokens();

  if (unauthorizedMode === "redirect") {
    redirect("/login");
  }
}

async function coreFetch<T>(
  path: string,
  config: RequestConfig | undefined,
  options: FetchOptions,
  isRetry = false,
): Promise<T> {
  const {
    method = "GET",
    body,
    headers: extraHeaders = {},
    cache = "no-store",
    next,
  } = config ?? {};
  const unauthorizedMode = options.unauthorizedMode ?? "redirect";

  const accessToken = options.withAuth ? await getAccessToken() : undefined;
  const endpoint = `${BASE_URL}${path}`;
  const headers = {
    ...buildBaseHeaders(accessToken),
    ...extraHeaders,
  };

  logApiRequest({ method, endpoint, headers, payload: body });

  const res = await fetch(endpoint, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
    cache,
    next,
  });

  if (res.status === 401 && options.withAuth && !isRetry) {
    const newAccessToken = await doRefreshToken();

    if (!newAccessToken) {
      await handleUnauthorized(unauthorizedMode);
      throw new ApiErrorClass("Unauthorized", 401);
    }

    const retryRes = await fetch(endpoint, {
      method,
      headers: {
        ...buildBaseHeaders(newAccessToken),
        ...extraHeaders,
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
      cache,
      next,
    });

    if (!retryRes.ok) {
      let message = `Request failed with status ${retryRes.status}`;
      let errors: Record<string, string[]> | undefined;
      try {
        const errJson = await retryRes.json();
        if (errJson?.message) message = errJson.message;
        if (errJson?.errors) errors = errJson.errors;
      } catch {
        /* ignore */
      }
      throw new ApiErrorClass(message, retryRes.status, errors);
    }

    const retryJson: ApiResponse<T> = await retryRes.json();
    logApiResponse({
      method,
      endpoint,
      status: retryRes.status,
      response: retryJson.data,
    });
    return retryJson.data;
  }

  if (!res.ok) {
    let message = `Request failed with status ${res.status}`;
    let errors: Record<string, string[]> | undefined;

    try {
      const errJson = await res.json();
      if (errJson?.message) message = errJson.message;
      if (errJson?.errors) errors = errJson.errors;
    } catch {
      /* ignore */
    }

    throw new ApiErrorClass(message, res.status, errors);
  }

  const json: ApiResponse<T> = await res.json();
  logApiResponse({
    method,
    endpoint,
    status: res.status,
    response: json.data,
  });
  return json.data;
}

async function coreFetchResponse<T>(
  path: string,
  config: RequestConfig | undefined,
  options: FetchOptions,
  isRetry = false,
): Promise<ApiResponse<T>> {
  const {
    method = "GET",
    body,
    headers: extraHeaders = {},
    cache = "no-store",
    next,
  } = config ?? {};
  const unauthorizedMode = options.unauthorizedMode ?? "redirect";

  const accessToken = options.withAuth ? await getAccessToken() : undefined;
  const endpoint = `${BASE_URL}${path}`;
  const headers = {
    ...buildBaseHeaders(accessToken),
    ...extraHeaders,
  };

  logApiRequest({ method, endpoint, headers, payload: body });

  const res = await fetch(endpoint, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
    cache,
    next,
  });

  if (res.status === 401 && options.withAuth && !isRetry) {
    const newAccessToken = await doRefreshToken();

    if (!newAccessToken) {
      await handleUnauthorized(unauthorizedMode);
      return {
        data: null as T,
        message: "Unauthorized",
        success: false,
        status: 401,
      };
    }

    const retryRes = await fetch(endpoint, {
      method,
      headers: {
        ...buildBaseHeaders(newAccessToken),
        ...extraHeaders,
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
      cache,
      next,
    });

    if (!retryRes.ok) {
      let message = `Request failed with status ${retryRes.status}`;
      let errors: Record<string, string[]> | undefined;
      try {
        const errJson = await retryRes.json();
        if (errJson?.message) message = errJson.message;
        if (errJson?.errors) errors = errJson.errors;
      } catch {
        /* ignore */
      }

      return {
        data: null as T,
        message,
        success: false,
        errors,
        status: retryRes.status,
      };
    }

    const retryJson: ApiResponse<T> = await retryRes.json();
    logApiResponse({
      method,
      endpoint,
      status: retryRes.status,
      response: retryJson.data,
    });
    return retryJson;
  }

  if (!res.ok) {
    let message = `Request failed with status ${res.status}`;
    let errors: Record<string, string[]> | undefined;

    try {
      const errJson = await res.json();
      if (errJson?.message) message = errJson.message;
      if (errJson?.errors) errors = errJson.errors;
    } catch {
      /* ignore */
    }

    return {
      data: null as T,
      message,
      success: false,
      errors,
      status: res.status,
    };
  }

  const json: ApiResponse<T> = await res.json();
  logApiResponse({
    method,
    endpoint,
    status: res.status,
    response: json.data,
  });
  return json;
}

export async function proxyGatewayRequest(
  pathWithQuery: string,
  config: RequestConfig = {},
): Promise<Response> {
  const {
    method = "GET",
    body,
    headers: extraHeaders = {},
    cache = "no-store",
  } = config;

  const accessToken = await getAccessToken();
  const endpoint = `${BASE_URL}${pathWithQuery}`;

  const execute = async (token?: string) =>
    fetch(endpoint, {
      method,
      headers: {
        ...buildBaseHeaders(token),
        ...extraHeaders,
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
      cache,
    });

  let res = await execute(accessToken);

  if (res.status === 401 && !accessToken) {
    return res;
  }

  if (res.status === 401) {
    const newAccessToken = await doRefreshToken();

    if (!newAccessToken) {
      await clearTokens();
      return Response.json(
        {
          data: null,
          message: "Sesi berakhir, silakan login kembali",
          success: false,
          status: 401,
        },
        { status: 401 },
      );
    }

    res = await execute(newAccessToken);
  }

  return res;
}

export async function PublicRequest<T>(
  path: string,
  config?: RequestConfig,
): Promise<T> {
  return coreFetch<T>(path, config, { withAuth: false });
}

export async function Request<T>(
  path: string,
  config?: RequestConfig,
): Promise<T> {
  return coreFetch<T>(path, config, { withAuth: true });
}

export async function RequestResponse<T>(
  path: string,
  config?: RequestConfig,
): Promise<ApiResponse<T>> {
  return coreFetchResponse<T>(path, config, { withAuth: true });
}

export async function Get<T>(
  path: string,
  next?: NextFetchRequestConfig,
): Promise<T> {
  return Request<T>(path, { method: "GET", next });
}

export async function GetResponse<T>(
  path: string,
  next?: NextFetchRequestConfig,
): Promise<ApiResponse<T>> {
  return RequestResponse<T>(path, { method: "GET", next });
}

export async function Post<T>(path: string, data?: unknown): Promise<T> {
  return Request<T>(path, { method: "POST", body: data });
}

export async function PostResponse<T>(
  path: string,
  data?: unknown,
): Promise<ApiResponse<T>> {
  return RequestResponse<T>(path, { method: "POST", body: data });
}

export async function Put<T>(path: string, data?: unknown): Promise<T> {
  return Request<T>(path, { method: "PUT", body: data });
}

export async function PutResponse<T>(
  path: string,
  data?: unknown,
): Promise<ApiResponse<T>> {
  return RequestResponse<T>(path, { method: "PUT", body: data });
}

export async function Patch<T>(path: string, data?: unknown): Promise<T> {
  return Request<T>(path, { method: "PATCH", body: data });
}

export async function PatchResponse<T>(
  path: string,
  data?: unknown,
): Promise<ApiResponse<T>> {
  return RequestResponse<T>(path, { method: "PATCH", body: data });
}

export async function Del<T>(path: string): Promise<T> {
  return Request<T>(path, { method: "DELETE" });
}

export async function DelResponse<T>(path: string): Promise<ApiResponse<T>> {
  return RequestResponse<T>(path, { method: "DELETE" });
}

export async function PublicPost<T>(path: string, data?: unknown): Promise<T> {
  return PublicRequest<T>(path, { method: "POST", body: data });
}

export async function PublicPostResponse<T>(
  path: string,
  data?: unknown,
): Promise<ApiResponse<T>> {
  return coreFetchResponse<T>(
    path,
    { method: "POST", body: data },
    { withAuth: false },
  );
}

export async function PublicGet<T>(path: string): Promise<T> {
  return PublicRequest<T>(path, { method: "GET" });
}

export async function PublicGetResponse<T>(
  path: string,
): Promise<ApiResponse<T>> {
  return coreFetchResponse<T>(path, { method: "GET" }, { withAuth: false });
}
