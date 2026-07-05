export function isTransportResponse(value: unknown): value is Response {
  return value instanceof Response;
}
