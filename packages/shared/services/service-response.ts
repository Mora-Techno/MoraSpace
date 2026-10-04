import type { ApiSuccessResponse } from '../types/api.types';

type ServiceResponseOverride = {
  message?: string;
  statusCode?: number;
};

export function toServiceResponse<T>(
  res: ApiSuccessResponse<T>,
  override?: ServiceResponseOverride,
): ApiSuccessResponse<T> {
  return {
    ...res,
    message: override?.message ?? res.message,
    statusCode: res.statusCode ?? res.status ?? override?.statusCode,
  };
}
