// lib/query/hooks/users/useUpdateUserProfilePicture.ts
import { apiClient } from "@/lib/apiClient";
import { UpdateUserProfilePictureResponse } from "@/lib/types/user";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface UpdateProfilePictureParams {
  userId: string;
  file: File;
}

export function useUpdateUserProfilePicture() {
  const queryClient = useQueryClient();

  return useMutation<
    UpdateUserProfilePictureResponse,
    Error,
    UpdateProfilePictureParams
  >({
    mutationFn: async ({ userId, file }) => {
      const formData = new FormData();
      formData.append("file", file);

      const response =
        await apiClient.patchFormData<UpdateUserProfilePictureResponse>(
          `/cloudinary/${userId}/profile-picture`,
          formData
        );
      return response;
    },
    onSuccess: (data, variables) => {
      // Invalidate and refetch user queries
      queryClient.invalidateQueries({ queryKey: ["user", variables.userId] });
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
}
