import { useMutation, useQueryClient } from "@tanstack/react-query";
import { mutationKeys } from "../../keys/mutationKeys";
import { apiClient } from "@/lib/apiClient";
import { SuspendUserResponse } from "@/lib/types/user";
import { toast } from "sonner";

export function useSuspendUser() {
  const queryClient = useQueryClient();

  const suspendUserFn = async (userId: string) => {
    const response = await apiClient.post<SuspendUserResponse>(
      `/users/${userId}/suspend`
    );

    return response;
  };

  return useMutation({
    mutationKey: mutationKeys.suspendUser,
    mutationFn: suspendUserFn,
    onSuccess: (response, userId) => {
      queryClient.invalidateQueries({ queryKey: ["user", userId] });
      queryClient.invalidateQueries({ queryKey: ["users"] });

      toast.success(response.message || "User suspended successfully");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to suspend user");
      if (process.env.NODE_ENV === "development") {
        console.error(error);
      }
    },
  });
}
