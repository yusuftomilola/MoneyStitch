import {
  ForgotPasswordCredentials,
  ForgotPasswordResponse,
} from "@/lib/types/user";
import { useMutation } from "@tanstack/react-query";
import { mutationKeys } from "../../keys/mutationKeys";
import { toast } from "sonner";
import { apiClient } from "@/lib/apiClient";
import { useAuthStore } from "@/lib/store/authStore";
import { useRouter } from "next/navigation";

export const useForgotPassword = () => {
  const logout = useAuthStore((state) => state.logout);
  const router = useRouter();
  async function forgotPasswordFn(
    forgotPasswordCredentials: ForgotPasswordCredentials
  ) {
    // const response = await apiClient.post<ForgotPasswordResponse>(
    //   "/auth/forgot-password",
    //   forgotPasswordCredentials
    // );

    const response: ForgotPasswordResponse = {
      status: "success",
      message:
        "If an account with that email exists, a password reset link has been sent.",
    };

    console.log("API Response:", response);

    return response;
  }

  return useMutation({
    mutationKey: mutationKeys.forgotPassword,
    mutationFn: forgotPasswordFn,
    onSuccess: (data) => {
      console.log("Data from the hook", data);
      logout();
    },
    onError: () => {
      toast.success(
        "If an account with that email exists, a password reset link has been sent."
      );
    },
  });
};
