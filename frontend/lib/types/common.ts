export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationMeta;
}

export interface BaseFilters {
  search?: string;
  sortBy?: string;
  sortOrder?: "ASC" | "DESC";
  createdAfter?: string;
  createdBefore?: string;
}
