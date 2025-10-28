import { useMutation } from "@tanstack/react-query";
import { mutationKeys } from "../../keys/mutationKeys";
import { apiClient } from "@/lib/apiClient";
import { ResendVerifyEmailResponse } from "@/lib/types/user";
import { toast } from "sonner";

export function useResendVerifyEmail() {
  const resendVerifyEmailFn = async () => {
    try {
      const data = await apiClient.post<ResendVerifyEmailResponse>(
        "/auth/resend-verify-email"
      );
      return data;
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        console.log(error);
      }
    }
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
    },
  });
}
