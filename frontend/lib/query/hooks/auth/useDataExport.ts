import { useMutation } from "@tanstack/react-query";
import { mutationKeys } from "../../keys/mutationKeys";
import { apiClient } from "@/lib/apiClient";
import { DataExportResponse } from "@/lib/types/user";
import { toast } from "sonner";

export function useDataExport() {
  const dataExportFn = async () => {
    try {
      const data = await apiClient.post<DataExportResponse>(
        "/users/export-data"
      );
      return data;
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        console.log("FRONTEND - Error return from the backend api: ", error);
      }
    }
  };

  return useMutation({
    mutationKey: mutationKeys.dataExport,
    mutationFn: dataExportFn,
    onSuccess: (data) => {
      toast.success(
        data?.message ||
          "Data export has been sent to your email address successfully"
      );
    },
    onError: (error) => {
      toast.error(
        error.message || "Failed to send export data to user email address"
      );
    },
  });
}
