import { PaginationParams } from "@/lib/types/common";
import { UsersFilters } from "@/lib/types/filters";
import { usePaginatedQuery } from "../common/usePaginatedQuery";
import { User } from "@/lib/types/user";

export function useUsers(params: PaginationParams & UsersFilters) {
  return usePaginatedQuery<User, UsersFilters>({
    endpoint: "/users",
    queryKey: "users",
    params,
  });
}
