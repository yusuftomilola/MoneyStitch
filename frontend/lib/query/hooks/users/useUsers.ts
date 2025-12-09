import { PaginationParams } from "@/lib/types/common";
import { UsersFilters } from "@/lib/types/filters";
import { usePaginatedQuery } from "../common/usePaginatedQuery";
import { User } from "@/lib/types/user";

export function useUsers(params: PaginationParams & UsersFilters) {
  return usePaginatedQuery<User, UsersFilters>({
    endpoint: "/users",
    queryKey: "users",
    params,
    options: {
      staleTime: 5 * 60 * 1000, // 5 minutes - reduce unnecessary refetches
      gcTime: 10 * 60 * 1000, // 10 minutes - keep in cache memory longer - cache time
      refetchOnWindowFocus: false, // Don't refetch on tab focus
      refetchOnMount: false, // Don't refetch if cache is fresh
    },
  });
}
