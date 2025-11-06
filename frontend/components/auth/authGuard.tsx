"use client";

import React, { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthState } from "@/lib/store/authStore";
import { Loader2 } from "lucide-react";

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requiredRole?: "admin" | "user";
  fallback?: React.ReactNode;
}

export function AuthGuard({
  children,
  requireAuth = true,
  requiredRole,
  fallback,
}: AuthGuardProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isAuthenticated, isLoading } = useAuthState();

  useEffect(() => {
    if (isLoading) return;

    // if (requireAuth && !isAuthenticated) {
    //   const currentPath = window.location.pathname;
    //   const loginUrl = `/login?redirect=${encodeURIComponent(currentPath)}`;
    //   router.push(loginUrl);
    //   return;
    // }

    if (requiredRole && user && user.role !== requiredRole) {
      router.push("/dashboard?reason=permission-not-granted");
      return;
    }

    // handle redirect after login
    // const redirectPath = searchParams.get("redirect");
    // if (
    //   isAuthenticated &&
    //   redirectPath &&
    //   window.location.pathname === "/login"
    // ) {
    //   router.push(redirectPath);
    // }
  }, [
    isAuthenticated,
    user,
    isLoading,
    requireAuth,
    requiredRole,
    router,
    searchParams,
  ]);

  // Show loading state
  // if (isLoading) {
  //   return (
  //     fallback || (
  //       <div className="min-h-screen flex items-center justify-center">
  //         <div className="text-center">
  //           <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
  //           <p className="text-muted-foreground">Loading...</p>
  //         </div>
  //       </div>
  //     )
  //   );
  // }

  // check authentication requirement
  // if (requireAuth && !isAuthenticated) {
  //   return (
  //     fallback || (
  //       <div className="min-h-screen flex items-center justify-center">
  //         <div className="text-center">
  //           <p className="text-muted-foreground">Redirecting to login...</p>
  //         </div>
  //       </div>
  //     )
  //   );
  // }

  // check role requirement
  if (requiredRole && user && user.role !== requiredRole) {
    return (
      fallback || (
        <div className="min-h-screen flex items-center justify-cente">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
            <p className="text-muted-foreground">
              You don't have permission to access this page.
            </p>
          </div>
        </div>
      )
    );
  }

  return <>{children}</>;
}
