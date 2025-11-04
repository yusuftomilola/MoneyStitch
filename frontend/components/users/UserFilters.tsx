// components/users/UserFilters.tsx
import { GenericFilters } from "../common/GenericFilters";
import { UsersFilters as UserFiltersType } from "@/lib/types/filters";

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

  return (
    <GenericFilters
      filters={filters}
      onFiltersChange={onFiltersChange}
      onReset={onReset}
    >
      {/* User-specific filters */}
      <div className="w-[140px]">
        <select
          value={filters.role || ""}
          onChange={(e) => handleChange("role", e.target.value || undefined)}
          className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-[#2ECC71] focus:border-[#2ECC71] transition-all outline-none bg-white text-sm font-medium text-[#1A1A40]"
        >
          <option value="">🛡️ All Roles</option>
          <option value="user">👤 User</option>
          <option value="admin">⭐ Admin</option>
        </select>
      </div>

      <div className="w-[150px]">
        <select
          value={
            filters.isEmailVerified === undefined
              ? ""
              : filters.isEmailVerified
              ? "verified"
              : "unverified"
          }
          onChange={(e) => {
            const value = e.target.value;
            handleChange(
              "isEmailVerified",
              value === "" ? undefined : value === "verified"
            );
          }}
          className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-[#2ECC71] focus:border-[#2ECC71] transition-all outline-none bg-white text-sm font-medium text-[#1A1A40]"
        >
          <option value="">📧 All Email</option>
          <option value="verified">✅ Verified</option>
          <option value="unverified">⚠️ Unverified</option>
        </select>
      </div>

      <div className="w-[150px]">
        <select
          value={
            filters.isActive === undefined
              ? ""
              : filters.isActive
              ? "active"
              : "inactive"
          }
          onChange={(e) => {
            const value = e.target.value;
            handleChange(
              "isActive",
              value === "" ? undefined : value === "active"
            );
          }}
          className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-[#2ECC71] focus:border-[#2ECC71] transition-all outline-none bg-white text-sm font-medium text-[#1A1A40]"
        >
          <option value="">🔄 All Status</option>
          <option value="active">✅ Active</option>
          <option value="inactive">⏸️ Inactive</option>
        </select>
      </div>
    </GenericFilters>
  );
}
