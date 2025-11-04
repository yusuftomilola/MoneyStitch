"use client";
import { useAuthStore } from "@/lib/store/authStore";
import { LoginUser } from "@/lib/types/user";
import { useMutation } from "@tanstack/react-query";
import { mutationKeys } from "../../keys/mutationKeys";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";

export function useLoginUser() {
  const login = useAuthStore((state) => state.login);
  const router = useRouter();
  const searchParams = useSearchParams();

  const loginUserFn = async (loginUserData: LoginUser) => {
    const loggedInUser = await login(loginUserData);
    return loggedInUser;
  };

  return useMutation({
    mutationKey: mutationKeys.loginUser,
    mutationFn: loginUserFn,
    onSuccess: () => {
      toast.success("User logged in successfully");
      const redirectTo = searchParams.get("redirect");
      router.push(redirectTo || "/dashboard");
    },
    onError: (error) => {
      toast.error(error.message || "Logging in user failed.");
      if (process.env.NODE_ENV === "development") {
        console.error(error);
      }
    },
  });
}
