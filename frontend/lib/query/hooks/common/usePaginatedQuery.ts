import { apiClient } from "@/lib/apiClient";
import type { PaginatedResponse, PaginationParams } from "@/lib/types/common";
import {
  keepPreviousData,
  useQuery,
  type UseQueryOptions,
} from "@tanstack/react-query";

interface UsePaginatedQueryOptions<T, TFilters> {
  endpoint: string;
  queryKey: string;
  params: PaginationParams & TFilters;
  options?: Omit<UseQueryOptions<PaginatedResponse<T>>, "queryKey" | "queryFn">;
}

export function usePaginatedQuery<T, TFilters extends object>({
  endpoint,
  queryKey,
  params,
  options,
}: UsePaginatedQueryOptions<T, TFilters>) {
  return useQuery<PaginatedResponse<T>>({
    queryKey: [queryKey, params],
    queryFn: async () => {
      const queryString = new URLSearchParams();

      Object.entries(params).forEach(([key, value]) => {
        // Check for boolean type first to ensure false values are included
        if (typeof value === "boolean") {
          queryString.append(key, String(value));
        } else if (value !== undefined && value !== null && value !== "") {
          queryString.append(key, String(value));
        }
      });

      const response = await apiClient.get<PaginatedResponse<T>>(
        `${endpoint}?${queryString.toString()}`
      );

      return response;
    },
    placeholderData: keepPreviousData,
    ...options,
  });
}
