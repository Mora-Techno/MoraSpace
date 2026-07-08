/** Path prefix API — base URL diatur per platform via `setBaseURLProvider`. */
export const api = "";
export const version = "/api";

export function buildEndpoint(mount: string, path = ""): string {
  return `${api}${version}${mount}${path}`;
}

export function listEndpoints(endpointsObj: Record<string, any>): string[] {
  return Object.values(endpointsObj).flatMap((val) =>
    typeof val === "string"
      ? [val]
      : typeof val === "function"
        ? []
        : Object.values(val),
  );
}
