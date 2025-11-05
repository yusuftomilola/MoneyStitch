"use client";

// components/users/UserFilters.tsx
import { GenericFilters } from "../common/GenericFilters";
import type { UsersFilters as UserFiltersType } from "@/lib/types/filters";

interface UserFiltersProps {
  filters: UserFiltersType;
  onFiltersChange: (filters: UserFiltersType) => void;
  onReset: () => void;
}

export function UserFilters({
  filters,
  onFiltersChange,
  onReset,
}: UserFiltersProps) {
  const handleChange = (key: keyof UserFiltersType, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    });
  };

  const handleStatusChange = (value: string) => {
    switch (value) {
      case "active":
        // Active means NOT suspended - send false for isSuspended
        onFiltersChange({
          ...filters,
          isSuspended: false, // FIXED: was true
        });
        break;
      case "suspended":
        // Suspended means IS suspended - send true for isSuspended
        onFiltersChange({
          ...filters,
          isSuspended: true, // FIXED: was false
        });
        break;
      default: // "all"
        onFiltersChange({
          ...filters,
          isSuspended: undefined,
        });
    }
  };

  const getCurrentStatus = () => {
    if (filters.isSuspended === true) return "suspended"; // FIXED: was false
    if (filters.isSuspended === false) return "active"; // FIXED: was true
    return "";
  };

  const getEmailVerificationStatus = () => {
    if (filters.isEmailVerified === true) return "verified"; // FIXED: was false
    if (filters.isEmailVerified === false) return "unverified"; // FIXED: was true
    return "";
  };

  return (
    <GenericFilters
      filters={filters}
      onFiltersChange={onFiltersChange}
      onReset={onReset}
      searchPlaceholder="Search users by name, email, username..."
    >
      {/* User-specific filters */}

      {/* ROLE FILTER */}
      <div className="w-[140px]">
        <label className="block text-xs font-medium text-gray-600 mb-1 ml-1">
          Role
        </label>
        <select
          value={filters.role || ""}
          onChange={(e) => handleChange("role", e.target.value || undefined)}
          className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-[#2ECC71] focus:border-[#2ECC71] transition-all outline-none bg-white text-sm font-medium text-[#1A1A40]"
          aria-label="Filter by role"
        >
          <option value="">🛡️ All Roles</option>
          <option value="user">👤 User</option>
          <option value="admin">⭐ Admin</option>
        </select>
      </div>

      {/* ACCOUNT STATUS FILTER - Only Active/Suspended */}
      <div className="w-[160px]">
        <label className="block text-xs font-medium text-gray-600 mb-1 ml-1">
          Account Status
        </label>
        <select
          value={getCurrentStatus()}
          onChange={(e) => handleStatusChange(e.target.value)}
          className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-[#2ECC71] focus:border-[#2ECC71] transition-all outline-none bg-white text-sm font-medium text-[#1A1A40]"
          aria-label="Filter by account status"
        >
          <option value="">🔄 All Status</option>
          <option value="active">✅ Active</option>
          <option value="suspended">🚫 Suspended</option>
        </select>
      </div>

      {/* EMAIL VERIFICATION FILTER */}
      <div className="w-[160px]">
        <label className="block text-xs font-medium text-gray-600 mb-1 ml-1">
          Email Status
        </label>
        <select
          value={getEmailVerificationStatus()}
          onChange={(e) => {
            const value = e.target.value;
            if (value === "") {
              handleChange("isEmailVerified", undefined);
            } else if (value === "verified") {
              // Send true to get verified emails
              handleChange("isEmailVerified", true); // FIXED: was false
            } else if (value === "unverified") {
              // Send false to get unverified emails
              handleChange("isEmailVerified", false); // FIXED: was true
            }
          }}
          className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-[#2ECC71] focus:border-[#2ECC71] transition-all outline-none bg-white text-sm font-medium text-[#1A1A40]"
          aria-label="Filter by email verification"
        >
          <option value="">📧 All Emails</option>
          <option value="verified">✅ Verified</option>
          <option value="unverified">⚠️ Unverified</option>
        </select>
      </div>
    </GenericFilters>
  );
}
