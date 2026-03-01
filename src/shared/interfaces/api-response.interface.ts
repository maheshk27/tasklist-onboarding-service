export interface ApiResponse<T> {
  success: boolean;
  code: string;
  message: string;
  data: T;
  meta?: PaginationMeta;
  errors?: ApiError[];
  statusCode?: number;
}

export interface ApiError {
  field?: string;
  message: string;
}

export interface PaginationMeta {
  page?: number;
  limit?: number;
  total?: number;
  totalPages?: number;
}