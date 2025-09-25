"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthState } from "../store/authStore";

interface UseAuthRedirectOptions {
  requireAuth?: boolean;
  requiredRole?: "admin" | "user";
  redirectTo?: string;
  redirectIfAuthenticated?: string;
}

export function useAuthRedirect({
  requireAuth = false,
  requiredRole,
  redirectTo = "/auth/login",
  redirectIfAuthenticated,
}: UseAuthRedirectOptions = {}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isAuthenticated, isLoading } = useAuthState();

  useEffect(() => {
    if (isLoading) return;

    // Redirect if authentication is required but user is not authenticated
    if (requireAuth && !isAuthenticated) {
      const currentPath = window.location.pathname;
      const loginUrl = `${redirectTo}?redirect=${encodeURIComponent(
        currentPath
      )}`;
      router.push(loginUrl);
      return;
    }

    // Redirect if user is authenticated but shouldn't be on this page
    if (isAuthenticated && redirectIfAuthenticated) {
      router.push(redirectIfAuthenticated);
      return;
    }

    // Redirect if user doesn't have required role
    if (requiredRole && user && user.role !== requiredRole) {
      router.push("/dashboard");
      return;
    }

    // Handle redirect after successful authentication
    const redirectPath = searchParams.get("redirect");
    if (isAuthenticated && redirectPath) {
      router.push(redirectPath);
    }
  }, [
    isAuthenticated,
    isLoading,
    user,
    requireAuth,
    requiredRole,
    redirectTo,
    redirectIfAuthenticated,
    router,
    searchParams,
  ]);

  return {
    isLoading,
    isAuthenticated,
    user,
    canAccess:
      isAuthenticated &&
      (!requiredRole || (user && user.role === requiredRole)),
  };
}
