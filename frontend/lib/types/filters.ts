// lib/types/filters.ts
import { BaseFilters } from "./common";

export interface UsersFilters extends BaseFilters {
  role?: "user" | "admin";
  isEmailVerified?: boolean;
  isActive?: boolean;
  isSuspended?: boolean;
}
