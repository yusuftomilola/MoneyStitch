import { useMutation, useQueryClient } from "@tanstack/react-query";
import { mutationKeys } from "../../keys/mutationKeys";
import {
  ChangePasswordCredentials,
  ChangePasswordResponse,
} from "@/lib/types/user";
import { apiClient } from "@/lib/apiClient";
import { toast } from "sonner";
import { useAuthStore } from "@/lib/store/authStore";
import { useRouter } from "next/navigation";

export function useChangePassword() {
  const logout = useAuthStore((state) => state.logout);
  const router = useRouter();
  const queryClient = useQueryClient();

  const changePasswordFn = async (
    changePasswordCredentials: ChangePasswordCredentials
  ) => {
    const data = await apiClient.post<ChangePasswordResponse>(
      "/auth/change-password",
      changePasswordCredentials
    );

    return data;
  };

  return useMutation({
    mutationKey: mutationKeys.changePassword,
    mutationFn: changePasswordFn,
    retry: 0, // dont retry password change due to security reason
    onSuccess: (data) => {
      toast.success(data.message || "Password changed successfully");
      queryClient.clear();
      logout();
      setTimeout(() => {
        router.push("/login?message=password-changed");
      }, 2000);
    },
    onError: (error: any) => {
      console.log(error);
      if (process.env.NODE_ENV === "development") {
        console.error("Password change error:", error);
      }

      // Network error
      //   if (!error.response) {
      //     toast.error("Network error. Please check your connection.");
      //     return;
      //   }

      //   // Server error
      //   if (error.response.status >= 500) {
      //     toast.error("Server error. Please try again later.");
      //     return;
      //   }

      // Unauthorized (token expired during password change)
      //   if (error.response.status === 401) {
      //     toast.error("Session expired. Please log in again.");
      //     logout();
      //     router.push("/login");
      //     router.refresh(); // Clear Next.js server cache
      //     return;
      //   }

      //   // Bad request (validation error)
      //   if (error.response.status === 400) {
      //     const message = error.response.data?.message || "Invalid input";
      //     toast.error(message);
      //     return;
      //   }

      //   toast.error(error?.message || "Failed to change password. Please try again later.");
    },
  });
}
