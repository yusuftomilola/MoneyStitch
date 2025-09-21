"use client";
import { useMutation } from "@tanstack/react-query";
import { mutationKeys } from "../../keys/mutationKeys";
import { toast } from "sonner";
import { apiClient } from "@/lib/apiClient";
import { useRouter } from "next/navigation";

const registerUserFn = async (data: any) => {
  return apiClient(data);
};

export function useRegisterUser() {
  const router = useRouter();

  return useMutation({
    mutationKey: mutationKeys.registerUser,
    mutationFn: registerUserFn,
    onSuccess: () => {
      toast.success("User created successfully");
      router.push("/");
    },
    onError: () => {
      toast.error("Error creating user");
    },
  });
}
