/** Path prefix API — base URL diatur per platform via `setBaseURLProvider`. */
export const api = "";
export const version = "/api";

export function buildEndpoint(mount: string, path = ""): string {
  return `${api}${version}${mount}${path}`;
}
