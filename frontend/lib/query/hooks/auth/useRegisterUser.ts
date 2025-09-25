"use client";
import { useMutation } from "@tanstack/react-query";
import { mutationKeys } from "../../keys/mutationKeys";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store/authStore";
import { RegisterUser } from "@/lib/types/user";

export function useRegisterUser() {
  const router = useRouter();
  const register = useAuthStore((state) => state.register);

  const registerUserFn = async (registerUser: RegisterUser) => {
    const createdUser = await register(registerUser);

    return createdUser;
  };

  return useMutation({
    mutationKey: mutationKeys.registerUser,
    mutationFn: registerUserFn,
    onSuccess: (data) => {
      console.log(data);
      toast.success("User created successfully");
      router.push("/");
    },
    onError: (error) => {
      toast.error("Error creating user");
      console.error("Register failed:", error);
    },
  });
}
