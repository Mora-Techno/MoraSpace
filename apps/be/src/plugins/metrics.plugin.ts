import { Elysia } from "elysia";
import { trace } from "@opentelemetry/api";
import { logger } from "@/utils/logger.utils";

/**
 * metricsPlugin
 * -------------
 * Records per-request metrics (HTTP method, endpoint, status, duration):
 *
 *  1. Emits a pino debug log with the metric fields.
 *  2. Enriches the active OpenTelemetry span with metric attributes
 *     (`http.route`, `http.request.method`, `http.response.status_code`,
 *     `http.duration_ms`) so they are visible inside Grafana Tempo traces.
 *
 * Requires the `opentelemetry` plugin from `@elysia/opentelemetry`, which is
 * registered globally in `src/app.ts`. The start time is captured per-request
 * via `derive()` (race-safe; Elysia does not expose `startedAt` in this
 * version), and the span is still live in `onAfterHandle`/`onError` because
 * the OTel plugin only ends the root span in `onAfterResponse`/`onError`.
 */
export const metricsPlugin = new Elysia()
  // Capture the request start time for this request only
  .derive(() => ({
    __requestStart: performance.now(),
  }))
  .onAfterHandle(({ request, set, __requestStart }: any) => {
    recordMetrics(request, set, performance.now() - __requestStart);
  })
  .onError(({ request, set, __requestStart, error }: any) => {
    recordMetrics(request, set, performance.now() - __requestStart, error);
  });

function recordMetrics(
  request: Request,
  set: { status?: unknown },
  durationMs: number,
  error?: unknown,
) {
  const duration = Math.round(durationMs);
  const method = request.method;
  const pathname = new URL(request.url).pathname;
  const status =
    typeof set?.status === "number" ? set.status : error ? 500 : 200;

  logger.debug(
    {
      method,
      endpoint: pathname,
      status,
      duration_ms: duration,
      ...(error
        ? { error: error instanceof Error ? error.message : String(error) }
        : {}),
    },
    "Metrics",
  );

  // Attach metric attributes to the active span (the root span created by
  // @elysia/opentelemetry) so they surface in Grafana Tempo traces.
  const span = trace.getActiveSpan();
  if (!span) return;

  span.setAttribute("http.request.method", method);
  span.setAttribute("http.route", pathname);
  span.setAttribute("http.response.status_code", status);
  span.setAttribute("http.duration_ms", duration);
  if (error) {
    span.setAttribute(
      "error.type",
      error instanceof Error ? error.name : typeof error,
    );
  }
}
