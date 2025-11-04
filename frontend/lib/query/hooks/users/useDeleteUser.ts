// lib/query/hooks/users/useDeleteUser.ts
import { apiClient } from "@/lib/apiClient";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface DeleteUserResponse {
  status: string;
  message: string;
  statusCode: number;
}

interface DeleteUserParams {
  userId: string;
}

export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation<DeleteUserResponse, Error, DeleteUserParams>({
    mutationFn: async ({ userId }) => {
      const response = await apiClient.delete<DeleteUserResponse>(
        `/users/${userId}`
      );
      return response;
    },
    onSuccess: (data, variables) => {
      // Invalidate and refetch users list
      queryClient.invalidateQueries({ queryKey: ["users"] });

      // Remove the specific user from cache
      queryClient.removeQueries({ queryKey: ["user", variables.userId] });

      // Show success message
      toast.success(data.message || "User deleted successfully!");
    },
    onError: (error: any) => {
      // Show error message
      toast.error(error.message || "Failed to delete user");

      if (process.env.NODE_ENV === "development") {
        console.error("Delete user error:", error);
      }
    },
  });
}
