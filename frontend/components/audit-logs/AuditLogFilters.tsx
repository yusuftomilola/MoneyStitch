// components/audit-logs/AuditLogFilters.tsx
"use client";

import { GenericFilters } from "../common/GenericFilters";
import {
  AuditLogFilters as AuditLogFiltersType,
  AuditAction,
  AuditStatus,
} from "@/lib/types/audit-log";

interface AuditLogFiltersProps {
  filters: AuditLogFiltersType;
  onFiltersChange: (filters: AuditLogFiltersType) => void;
  onReset: () => void;
}

export function AuditLogFilters({
  filters,
  onFiltersChange,
  onReset,
}: AuditLogFiltersProps) {
  const handleChange = (key: keyof AuditLogFiltersType, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    });
  };

  return (
    <GenericFilters
      filters={filters}
      onFiltersChange={onFiltersChange}
      onReset={onReset}
      searchPlaceholder="Search by user, email, IP address..."
    >
      {/* Action Filter */}
      <div className="w-[200px]">
        <label className="block text-xs font-medium text-gray-600 mb-1 ml-1">
          Action
        </label>
        <select
          value={filters.action || ""}
          onChange={(e) => handleChange("action", e.target.value || undefined)}
          className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-[#2ECC71] focus:border-[#2ECC71] transition-all outline-none bg-white text-sm font-medium text-[#1A1A40]"
        >
          <option value="">📋 All Actions</option>
          <optgroup label="Authentication">
            <option value={AuditAction.USER_LOGIN}>🔐 Login</option>
            <option value={AuditAction.USER_LOGOUT}>🚪 Logout</option>
            <option value={AuditAction.USER_REGISTER}>📝 Register</option>
            <option value={AuditAction.PASSWORD_CHANGE}>
              🔑 Password Change
            </option>
          </optgroup>
          <optgroup label="User Actions">
            <option value={AuditAction.USER_PROFILE_VIEW}>
              👁️ Profile View
            </option>
            <option value={AuditAction.USER_PROFILE_UPDATE}>
              ✏️ Profile Update
            </option>
            <option value={AuditAction.USER_DATA_EXPORT}>📤 Data Export</option>
          </optgroup>
          <optgroup label="Admin Actions">
            <option value={AuditAction.ADMIN_USER_VIEW}>
              👁️ Admin View User
            </option>
            <option value={AuditAction.ADMIN_USER_UPDATE}>
              ✏️ Admin Update User
            </option>
            <option value={AuditAction.ADMIN_USER_DELETE}>
              🗑️ Admin Delete User
            </option>
            <option value={AuditAction.ADMIN_USER_SUSPEND}>
              ⛔ Admin Suspend User
            </option>
            <option value={AuditAction.ADMIN_USER_ACTIVATE}>
              ✅ Admin Activate User
            </option>
          </optgroup>
        </select>
      </div>

      {/* Status Filter */}
      <div className="w-[150px]">
        <label className="block text-xs font-medium text-gray-600 mb-1 ml-1">
          Status
        </label>
        <select
          value={filters.status || ""}
          onChange={(e) => handleChange("status", e.target.value || undefined)}
          className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-[#2ECC71] focus:border-[#2ECC71] transition-all outline-none bg-white text-sm font-medium text-[#1A1A40]"
        >
          <option value="">🔄 All Status</option>
          <option value={AuditStatus.SUCCESS}>✅ Success</option>
          <option value={AuditStatus.FAILED}>❌ Failed</option>
          <option value={AuditStatus.UNAUTHORIZED}>🚫 Unauthorized</option>
        </select>
      </div>
    </GenericFilters>
  );
}
