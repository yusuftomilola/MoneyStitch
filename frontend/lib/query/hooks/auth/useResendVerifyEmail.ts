import { useMutation } from "@tanstack/react-query";
import { mutationKeys } from "../../keys/mutationKeys";
import { apiClient } from "@/lib/apiClient";
import { ResendVerifyEmailResponse } from "@/lib/types/user";
import { toast } from "sonner";

export function useResendVerifyEmail() {
  const resendVerifyEmailFn = async () => {
    const data = await apiClient.post<ResendVerifyEmailResponse>(
      "/auth/resend-verify-email"
    );
    return data;
  };

  return useMutation({
    mutationKey: mutationKeys.resendVerifyEmail,
    mutationFn: resendVerifyEmailFn,
    onSuccess: (data) => {
      toast.success(
        data?.message || "Verification email sent! Check your inbox."
      );
    },
    onError: (error) => {
      toast.error(
        error.message ||
          "Failed to re-send verification email. Kindly try again later."
      );
      if (process.env.NODE_ENV === "development") {
        console.error(error);
      }
    },
  });
}
