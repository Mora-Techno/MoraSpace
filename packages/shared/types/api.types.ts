export type HttpStatusCode =
  | 200
  | 201
  | 202
  | 204
  | 400
  | 401
  | 403
  | 404
  | 409
  | 422
  | 429
  | 500
  | 502
  | 503;

export interface ApiSuccessResponse<T = unknown> {
  data: T;
  message: string;
  success?: boolean;
  errors?: Record<string, string[]>;
  status?: number;
  statusCode?: number;
  meta?: {
    process_time?: string;
    currentPage?: number;
    limit?: number;
    totalData?: number;
    totalPage?: number;
    [key: string]: unknown;
  };
}

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly errors?: Record<string, string[]>,
  ) {
    super(message);
    this.name = 'ApiError';
  }

  get isAuthError() {
    return this.status === 401;
  }
  get isForbidden() {
    return this.status === 403;
  }
  get isNotFound() {
    return this.status === 404;
  }
  get isValidationError() {
    return this.status === 422;
  }
}

export type TPagedList<T> = {
  items: T[];
  totalData: number;
  totalPages: number;
};

export type TPagedListResponse<T> = ApiSuccessResponse<TPagedList<T>>;

export interface IApi {
  id: string;
  query: string;
}

export type PickApiID = Pick<IApi, 'id'>;
