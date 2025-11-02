"use client";
import { apiClient } from "@/lib/apiClient";
import { useAuthStore } from "@/lib/store/authStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { mutationKeys } from "../../keys/mutationKeys";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function useLogoutUser() {
  const logout = useAuthStore((state) => state.logout);
  const queryClient = useQueryClient();
  const router = useRouter();

  const logoutUserFn = async () => {
    let data;
    try {
      data = await apiClient.logout();
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        console.warn(
          "Logout API call failed, continuing with local logout",
          error
        );
      }
    }
    // Always clear local state regardless of API result
    logout();
    return data;
  };

  return useMutation({
    mutationKey: mutationKeys.logoutUser,
    mutationFn: logoutUserFn,
    onSuccess: (data) => {
      // clear all queries on logout
      queryClient.clear();
      toast.success(data?.message || "User logged out successful");
      router.push("/");
    },
    onError: (error) => {
      toast.error(error.message || "Error logging out user.");
    },
  });
}
