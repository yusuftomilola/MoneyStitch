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
    onError: (error) => {
      if (process.env.NODE_ENV === "development") {
        console.error("Password change error:", error);
      }

      toast.error(
        error.message || "Failed to change password. Please try again later."
      );
    },
  });
}
