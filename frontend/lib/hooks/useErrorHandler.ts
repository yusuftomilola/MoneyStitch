"use client";

import { useCallback } from "react";
import { useAuthStore } from "../store/authStore";

export function useErrorHandler() {
  const logout = useAuthStore((state) => state.logout);

  const handleError = useCallback(
    (error: any) => {
      console.error("API Error:", error);

      // Handle authentication errors
      if (error?.statusCode === 401) {
        // Token expired or invalid, logout user
        logout();
        return;
      }

      // Handle other specific error codes
      switch (error?.statusCode) {
        case 403:
          console.warn("Access forbidden:", error.message);
          break;
        case 404:
          console.warn("Resource not found:", error.message);
          break;
        case 500:
          console.error("Server error:", error.message);
          break;
        default:
          console.error("Unexpected error:", error.message);
      }
    },
    [logout]
  );

  return { handleError };
}
