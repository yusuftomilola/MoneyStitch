import { useMutation, useQueryClient } from "@tanstack/react-query";
import { mutationKeys } from "../../keys/mutationKeys";
import { apiClient } from "@/lib/apiClient";
import { ActivateUserResponse } from "@/lib/types/user";
import { toast } from "sonner";

export function useActivateUser() {
  const queryClient = useQueryClient();

  const activateUserFn = async (userId: string) => {
    const response = await apiClient.post<ActivateUserResponse>(
      `/users/${userId}/activate`
    );

    return response;
  };

  return useMutation({
    mutationKey: mutationKeys.activateUser,
    mutationFn: activateUserFn,
    onSuccess: (response, userId) => {
      queryClient.invalidateQueries({ queryKey: ["user", userId] });
      queryClient.invalidateQueries({ queryKey: ["users"] });

      toast.success(response.message || "User activated successfully");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to activate user");
      if (process.env.NODE_ENV === "development") {
        console.error(error);
      }
    },
  });
}
