// frontend/lib/hooks/AuthInitializer.tsx
"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/lib/store/authStore";

export function AuthInitializer({ children }: { children: React.ReactNode }) {
  // Select the function directly for a stable reference
  const initializeAuth = useAuthStore((state) => state.initializeAuth);

  useEffect(() => {
    // Initialize auth on mount
    initializeAuth();
  }, [initializeAuth]);

  return <>{children}</>;
}
