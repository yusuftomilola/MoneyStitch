// pages/admin/users.tsx
"use client";
import { useState } from "react";
import { useUsers } from "@/lib/query/hooks/users/useUsers";
import { UserFilters } from "@/components/users/UserFilters";
import { Pagination } from "@/components/common/Pagination";
import { UsersFilters as UserFiltersType } from "@/lib/types/filters";
import { UserTableRow } from "@/components/users/UserTableRow";
import {
  Users,
  Mail,
  Phone,
  Calendar,
  Shield,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

export default function UsersPage() {
  const [page, setPage] = useState(1);
  const [limit] = useState(2);
  const [filters, setFilters] = useState<UserFiltersType>({
    sortBy: "createdAt",
    sortOrder: "DESC",
  });

  const { data, isLoading, isError } = useUsers({
    page,
    limit,
    ...filters,
  });

  const handleFiltersChange = (newFilters: UserFiltersType) => {
    setFilters(newFilters);
    setPage(1);
  };

  const handleResetFilters = () => {
    setFilters({
      sortBy: "createdAt",
      sortOrder: "DESC",
    });
    setPage(1);
  };

  const handleSort = (field: string) => {
    if (filters.sortBy === field) {
      // Toggle order
      setFilters({
        ...filters,
        sortOrder: filters.sortOrder === "ASC" ? "DESC" : "ASC",
      });
    } else {
      // New field, default to DESC
      setFilters({
        ...filters,
        sortBy: field,
        sortOrder: "DESC",
      });
    }
    setPage(1);
  };

  const SortIcon = ({ field }: { field: string }) => {
    if (filters.sortBy !== field) return null;
    return filters.sortOrder === "ASC" ? (
      <ChevronUp className="w-4 h-4" />
    ) : (
      <ChevronDown className="w-4 h-4" />
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-[#2ECC71] border-t-transparent"></div>
          <p className="mt-4 text-[#1A1A40] font-medium">Loading users...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md">
          <div className="text-red-500 text-center">
            <svg
              className="w-16 h-16 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 className="text-xl font-bold text-[#1A1A40] mb-2">
              Error Loading Users
            </h3>
            <p className="text-gray-600">
              Unable to fetch users. Please try again later.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-br from-[#2ECC71] to-[#27AE60] rounded-lg shadow-md">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-[#1A1A40]">
                Users Management
              </h1>
              <p className="text-sm text-gray-600">
                Manage and monitor all platform users
              </p>
            </div>
          </div>
        </div>

        {/* Filters Section */}
        <div className="mb-4">
          <UserFilters
            filters={filters}
            onFiltersChange={handleFiltersChange}
            onReset={handleResetFilters}
          />
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
          {/* Table Header with Results Count */}
          <div className="px-6 py-3 bg-gradient-to-r from-gray-50 to-white border-b border-gray-200">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-[#1A1A40]">
                Showing{" "}
                <span className="text-[#2ECC71] font-bold">
                  {data?.data.length}
                </span>{" "}
                of{" "}
                <span className="text-[#2ECC71] font-bold">
                  {data?.pagination.total}
                </span>{" "}
                users
              </span>
              <span className="text-xs text-gray-500">
                Page {page} of {data?.pagination.totalPages}
              </span>
            </div>
          </div>

          {data?.data.length === 0 ? (
            <div className="p-12 text-center">
              <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-[#1A1A40] mb-2">
                No Users Found
              </h3>
              <p className="text-gray-500">
                Try adjusting your filters to see more results.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#1A1A40] text-white">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">
                      <button
                        onClick={() => handleSort("email")}
                        className="flex items-center gap-1 hover:text-[#2ECC71] transition-colors"
                      >
                        <Mail className="w-4 h-4" />
                        Contact
                        <SortIcon field="email" />
                      </button>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">
                      <button
                        onClick={() => handleSort("role")}
                        className="flex items-center gap-1 hover:text-[#2ECC71] transition-colors"
                      >
                        <Shield className="w-4 h-4" />
                        Role
                        <SortIcon field="role" />
                      </button>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">
                      <button
                        onClick={() => handleSort("createdAt")}
                        className="flex items-center gap-1 hover:text-[#2ECC71] transition-colors"
                      >
                        <Calendar className="w-4 h-4" />
                        Joined
                        <SortIcon field="createdAt" />
                      </button>
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {data?.data.map((user) => (
                    <UserTableRow key={user.id} user={user} />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pagination */}
        {data && data.pagination.totalPages > 1 && (
          <div className="mt-4">
            <Pagination pagination={data.pagination} onPageChange={setPage} />
          </div>
        )}
      </div>
    </div>
  );
}
