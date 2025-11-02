import { useMutation, useQueryClient } from "@tanstack/react-query";
import { mutationKeys } from "../../keys/mutationKeys";
import { apiClient } from "@/lib/apiClient";
import {
  UpdateUserProfileCredentials,
  UpdateUserProfileResponse,
} from "@/lib/types/user";
import { useAuthStore } from "@/lib/store/authStore";
import { toast } from "sonner";

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  const updateProfile = useAuthStore((state) => state.updateProfile);

  const updateProfileFn = async (
    updateUserProfileCredentials: UpdateUserProfileCredentials
  ) => {
    const data = await apiClient.patch<UpdateUserProfileResponse>(
      "/users/me/update",
      updateUserProfileCredentials
    );

    return data;
  };

  return useMutation({
    mutationKey: mutationKeys.updateProfile,
    mutationFn: updateProfileFn,
    onSuccess: (data) => {
      updateProfile(data?.user);

      queryClient.invalidateQueries({ queryKey: ["user"] });

      toast.success(data?.message || "User profile updated successfully");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update user profile");
    },
  });
}
