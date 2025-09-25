"use client";

import React from "react";
import { useAuthState } from "@/lib/store/authStore";

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: ("admin" | "user")[];
  fallback?: React.ReactNode;
  showFallback?: boolean;
}

export function RoleGuard({
  children,
  allowedRoles,
  fallback,
  showFallback = true,
}: RoleGuardProps) {
  const { isAuthenticated, user } = useAuthState();

  if (!isAuthenticated || !user) {
    return showFallback ? fallback || null : null;
  }

  if (!allowedRoles.includes(user.role)) {
    return showFallback ? fallback || null : null;
  }

  return <>{children}</>;
}
