"use client";

import { useAuthState } from "@/lib/store/authStore";
import Link from "next/link";

export function AuthStatus() {
  const { isAuthenticated, isLoading } = useAuthState();

  if (isLoading) {
    return <div className="h-8 w-8 animate-pulse bg-muted rounded-full" />;
  }

  if (isAuthenticated) {
    return (
      <div>
        <h2 className="font-bold text-green-500">| User Menu</h2>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <button>
        <Link href="/login">Login</Link>
      </button>
      <button>
        <Link href="/register">Register</Link>
      </button>
    </div>
  );
}
