import type { ApiSuccessResponse } from "../types/api.types";

type ServiceResponseOverride = {
  message?: string;
  statusCode?: number;
};

export function toServiceResponse<T>(
  res: ApiSuccessResponse<T>,
  override?: ServiceResponseOverride,
): ApiSuccessResponse<T> {
  return {
    data: res.data,
    message: override?.message ?? res.message,
  };
}
