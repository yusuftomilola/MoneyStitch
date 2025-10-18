"use client";

import { useCallback } from "react";
import { useAuthStore } from "../store/authStore";

export function useErrorHandler() {
  const logout = useAuthStore((state) => state.logout);

  const handleError = useCallback(
    (error: any) => {
      console.error("API Error:", error);

      // Handle authentication errors
      // Note: 401 errors are now handled by apiClient with automatic refresh
      // If we get a 401 here, it means the refresh has already failed
      if (error?.statusCode === 401) {
        // Token refresh failed, logout user
        logout();

        // Optional: Show a toast/notification to user
        console.warn("Session expired. Please login again.");
        return;
      }

      // Handle other specific error codes
      switch (error?.statusCode) {
        case 403:
          console.warn("Access forbidden:", error.message);
          // Optional: Show toast notification
          break;
        case 404:
          console.warn("Resource not found:", error.message);
          // Optional: Show toast notification
          break;
        case 500:
          console.error("Server error:", error.message);
          // Optional: Show toast notification
          break;
        default:
          console.error("Unexpected error:", error.message);
      }
    },
    [logout]
  );

  return { handleError };
}
