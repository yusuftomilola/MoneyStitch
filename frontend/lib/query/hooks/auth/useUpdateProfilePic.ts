import { useMutation, useQueryClient } from "@tanstack/react-query";
import { mutationKeys } from "../../keys/mutationKeys";
import { apiClient } from "@/lib/apiClient";
import { useAuthStore } from "@/lib/store/authStore";
import { UpdateUserProfilePictureResponse } from "@/lib/types/user";
import { toast } from "sonner";

export function useUpdateProfilePic() {
  const queryClient = useQueryClient();
  const updateProfile = useAuthStore((state) => state.updateProfile);

  const updateProfilePicFn = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    const response =
      await apiClient.patchFormData<UpdateUserProfilePictureResponse>(
        "/cloudinary/profile-picture",
        formData
      );

    return response;
  };

  return useMutation({
    mutationKey: mutationKeys.updateProfilePic,
    mutationFn: updateProfilePicFn,
    onSuccess: (response) => {
      updateProfile(response.user);

      queryClient.invalidateQueries({ queryKey: ["user"] });

      toast.success(response.message || "Profile picture updated successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update profile picture");
    },
  });
}
