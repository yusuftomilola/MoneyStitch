// lib/query/hooks/users/useUpdateUser.ts
import { apiClient } from "@/lib/apiClient";
import {
  UpdateUserProfileCredentials,
  UpdateUserProfileResponse,
} from "@/lib/types/user";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface UpdateUserParams {
  userId: string;
  data: UpdateUserProfileCredentials;
}

export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation<UpdateUserProfileResponse, Error, UpdateUserParams>({
    mutationFn: async ({ userId, data }) => {
      const response = await apiClient.patch<UpdateUserProfileResponse>(
        `/users/${userId}`,
        data
      );
      return response;
    },
    onSuccess: (data, variables) => {
      // Invalidate and refetch user queries
      queryClient.invalidateQueries({ queryKey: ["user", variables.userId] });
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
}
