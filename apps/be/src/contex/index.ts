import type { Context } from "elysia";
import type { JwtPayload } from "@repo/types/auth.types";
import type { AppFile } from "@/types/app.types";
import { RequestStore } from "@/types/request.types";

export interface AppContext extends Omit<Context, "body" | "query" | "params"> {
  user?: JwtPayload;
  json?: (data: unknown, status?: number) => Response;
  files?: Record<string, AppFile[]>;
  body: unknown;
  query: Record<string, unknown>;
  params: Record<string, string>;
  store: RequestStore;
}

export type ElysiaHandler = (
  c: AppContext,
) => Promise<Response | void> | Response | void;
export type ElysiaMiddleware = (
  c: AppContext,
) => Promise<void | Response> | void | Response;
