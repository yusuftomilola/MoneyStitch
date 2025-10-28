import { useMutation, useQueryClient } from "@tanstack/react-query";
import { mutationKeys } from "../../keys/mutationKeys";
import { apiClient } from "@/lib/apiClient";
import { useAuthStore } from "@/lib/store/authStore";
import { DeleteUserResponse } from "@/lib/types/user";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function useDeleteUser() {
  const logout = useAuthStore((state) => state.logout);
  const router = useRouter();
  const queryClient = useQueryClient();

  const deleteUserFn = async () => {
    let data;
    try {
      data = await apiClient.delete<DeleteUserResponse>("/users/me/delete");
      if (process.env.NODE_ENV === "development") {
        console.log(data);
      }
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        console.log("Frontend - Error deleting user", error);
      }
    }

    logout();
    return data;
  };

  return useMutation({
    mutationKey: mutationKeys.deleteUser,
    mutationFn: deleteUserFn,
    onSuccess: (data) => {
      queryClient.clear();
      toast.success(data?.message || "User account deleted successfully");
      router.push("/");
    },
    onError: (error) => {
      toast.error(error.message || "Error deleting user account");
    },
  });
}
