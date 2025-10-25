import { useMutation } from "@tanstack/react-query";
import { mutationKeys } from "../../keys/mutationKeys";
import { VerifyEmailCredentials, VerifyEmailResponse } from "@/lib/types/user";
import { apiClient } from "@/lib/apiClient";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store/authStore";

export function useVerifyEmail() {
  const router = useRouter();
  const updateEmailVerificationStatus = useAuthStore(
    (state) => state.updateEmailVerificationStatus
  );

  const verifyEmailFn = async (
    verifyEmailCredentials: VerifyEmailCredentials
  ) => {
    const response = await apiClient.post<VerifyEmailResponse>(
      "/auth/verify-email",
      verifyEmailCredentials
    );

    return response;
  };

  return useMutation({
    mutationKey: mutationKeys.verifyEmail,
    mutationFn: verifyEmailFn,
    onSuccess: (response) => {
      updateEmailVerificationStatus(true);
      toast.success(response.message);
      setTimeout(() => {
        router.push("/");
      }, 3000);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
}
