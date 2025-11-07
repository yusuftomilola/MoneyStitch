// lib/query/hooks/users/useUser.ts
import { apiClient } from "@/lib/apiClient";
import { User } from "@/lib/types/user";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";

interface UseUserOptions {
  userId: string;
  options?: Omit<UseQueryOptions<User, Error>, "queryKey" | "queryFn">;
}

export function useUser({ userId, options }: UseUserOptions) {
  return useQuery<User, Error>({
    queryKey: ["user", userId],
    queryFn: async () => {
      const response = await apiClient.get<User>(`/users/${userId}`);
      return response;
    },
    enabled: !!userId, // Only run query if userId exists
    staleTime: 5 * 60 * 1000, // 5 minutes - reduce unnecessary refetches
    gcTime: 10 * 60 * 1000, // 10 minutes - keep in cache longer
    ...options,
  });
}
