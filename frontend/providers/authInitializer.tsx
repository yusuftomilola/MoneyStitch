"use client";
import { useAuthInit } from "@/lib/hooks/useAuthInit";
import React from "react";

export function AuthInitializerProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useAuthInit();

  return <>{children}</>;
}
