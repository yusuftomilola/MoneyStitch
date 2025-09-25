"use client";

import { useEffect } from "react";
import { useAuthStore } from "../store/authStore";

export const useAuthInit = () => {
  const initializeAuth = useAuthStore((state) => state.initializeAuth);

  useEffect(() => {
    // initialize auth state (access token and user object) from localstorage into zustand local ui state on app startup
    initializeAuth();
  }, [initializeAuth]);
};
