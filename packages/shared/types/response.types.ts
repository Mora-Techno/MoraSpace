import type { ApiError, ApiSuccessResponse, TPagedList, TPagedListResponse } from './api.types';

export type TResponse<T = unknown> = ApiSuccessResponse<T>;
export type TListResponse<T = unknown> = ApiSuccessResponse<T[]>;
export type TErrorResponse = ApiError;
export type { TPagedList, TPagedListResponse };
