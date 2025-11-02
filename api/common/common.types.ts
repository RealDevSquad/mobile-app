export interface TApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  next?: string;
  hasMore: boolean;
  total?: number;
}

export interface ApiError {
  message: string;
  status: number;
  code?: string;
}
