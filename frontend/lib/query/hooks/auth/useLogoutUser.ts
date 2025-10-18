import { apiClient } from "@/lib/apiClient";
import { useAuthStore } from "@/lib/store/authStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useLogoutUser() {
  const logout = useAuthStore((state) => state.logout);
  const queryClient = useQueryClient();

  const logoutUserFn = async () => {
    try {
      await apiClient.logout();
    } catch (error) {
      console.warn(
        "Logout API call failed, continuing with local logout",
        error
      );
    }
    // Always clear local state regardless of API result
    logout();
  };

  return useMutation({
    mutationKey: ["logoutUser"],
    mutationFn: logoutUserFn,
    onSuccess: () => {
      // clear all queries on logout
      queryClient.clear();
    },
  });
}
