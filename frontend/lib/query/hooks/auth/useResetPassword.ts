import { useMutation } from "@tanstack/react-query";
import { mutationKeys } from "../../keys/mutationKeys";
import {
  ResetPasswordCredentials,
  ResetPasswordResponse,
} from "@/lib/types/user";
import { apiClient } from "@/lib/apiClient";
import { toast } from "sonner";

export function useResetPassword() {
  const resetPasswordFn = async (
    resetPasswordCredentials: ResetPasswordCredentials
  ) => {
    const response = await apiClient.post<ResetPasswordResponse>(
      "/auth/reset-password",
      resetPasswordCredentials
    );

    console.log("API Backend Response: ", response);

    return response;
  };

  return useMutation({
    mutationKey: mutationKeys.resetPassword,
    mutationFn: resetPasswordFn,
    onError: (error) => {
      toast.error(error.message);
    },
  });
}
