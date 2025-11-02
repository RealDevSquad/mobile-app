export type TApiResponse<T> = {
  data: T;
  message: string;
  success: boolean;
};

export type PaginatedResponse<T> = {
  data: T[];
  next?: string;
  hasMore: boolean;
  total?: number;
};

export type ApiError = {
  message: string;
  status: number;
  code?: string;
};
