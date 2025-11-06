// app/(dashboard)/security/activity/page.tsx
"use client";

import { useState } from "react";
import { useCriticalAuditLogs } from "@/lib/query/hooks/audit-logs/useCriticalAuditlogs";
import { CriticalAuditLogTable } from "@/components/audit-logs/CriticalAuditLogTable";
import { Pagination } from "@/components/common/Pagination";
import {
  Shield,
  Activity,
  Clock,
  CheckCircle,
  Calendar,
  RotateCcw,
} from "lucide-react";
import type { CriticalAuditLogFilters } from "@/lib/query/hooks/audit-logs/useCriticalAuditlogs";
import { AuditStatus } from "@/lib/types/audit-log";

export default function SecurityActivityPage() {
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [filters, setFilters] = useState<CriticalAuditLogFilters>({
    sortBy: "createdAt",
    sortOrder: "DESC",
  });

  const { data, isLoading, isError } = useCriticalAuditLogs({
    page,
    limit,
    ...filters,
  });

  const handleFilterChange = (
    key: keyof CriticalAuditLogFilters,
    value: any
  ) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
    setPage(1);
  };

  const handleReset = () => {
    setFilters({
      sortBy: "createdAt",
      sortOrder: "DESC",
    });
    setPage(1);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-[#2ECC71] border-t-transparent"></div>
          <p className="mt-4 text-[#1A1A40] font-medium">
            Loading security activity...
          </p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md">
          <div className="text-red-500 text-center">
            <h3 className="text-xl font-bold text-[#1A1A40] mb-2">
              Error Loading Security Activity
            </h3>
            <p className="text-gray-600">
              Unable to fetch security logs. Please try again later.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const successCount =
    data?.data.filter((log) => log.status === AuditStatus.SUCCESS).length || 0;
  const failedCount =
    data?.data.filter((log) => log.status !== AuditStatus.SUCCESS).length || 0;

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3">
            <Shield className="w-8 h-8 text-[#2ECC71]" />
            <div>
              <h1 className="text-3xl font-bold text-[#1A1A40]">
                Security Activity
              </h1>
              <p className="text-sm text-gray-600">
                Track important security events and account changes
              </p>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Events
                </p>
                <p className="text-2xl font-bold text-[#1A1A40]">
                  {data?.pagination.total.toLocaleString() || 0}
                </p>
              </div>
              <Activity className="w-8 h-8 text-[#2ECC71]" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Successful</p>
                <p className="text-2xl font-bold text-green-600">
                  {successCount.toLocaleString()}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Failed Attempts
                </p>
                <p className="text-2xl font-bold text-red-600">
                  {failedCount.toLocaleString()}
                </p>
              </div>
              <Activity className="w-8 h-8 text-red-600" />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
          <div className="flex flex-wrap items-center gap-3">
            {/* Sort By */}
            {/* <div className="w-[160px]">
              <label className="block text-xs font-medium text-gray-600 mb-1 ml-1">
                Sort By
              </label>
              <select
                value={filters.sortBy || "createdAt"}
                onChange={(e) => handleFilterChange("sortBy", e.target.value)}
                className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-[#2ECC71] focus:border-[#2ECC71] transition-all outline-none bg-white text-sm font-medium text-[#1A1A40]"
              >
                <option value="createdAt">📅 Created Date</option>
              </select>
            </div> */}

            {/* Sort Order */}
            <div className="w-[120px]">
              <label className="block text-xs font-medium text-gray-600 mb-1 ml-1">
                Sort Order
              </label>
              <select
                value={filters.sortOrder || "DESC"}
                onChange={(e) =>
                  handleFilterChange(
                    "sortOrder",
                    e.target.value as "ASC" | "DESC"
                  )
                }
                className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-[#2ECC71] focus:border-[#2ECC71] transition-all outline-none bg-white text-sm font-medium text-[#1A1A40]"
              >
                <option value="DESC">↓ Newest</option>
                <option value="ASC">↑ Oldest</option>
              </select>
            </div>

            {/* Date Range */}
            <div className="flex items-center gap-2">
              {/* From Date */}
              <div className="w-[170px]">
                <label className="block text-xs font-medium text-gray-600 mb-1 ml-1">
                  <Calendar className="w-3 h-3 inline mr-1" />
                  From Date
                </label>
                <input
                  type="date"
                  value={filters.createdAfter || ""}
                  onChange={(e) =>
                    handleFilterChange(
                      "createdAfter",
                      e.target.value || undefined
                    )
                  }
                  className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-[#2ECC71] focus:border-[#2ECC71] transition-all outline-none text-sm text-[#1A1A40]"
                />
              </div>

              {/* To Date */}
              <div className="w-[170px]">
                <label className="block text-xs font-medium text-gray-600 mb-1 ml-1">
                  <Calendar className="w-3 h-3 inline mr-1" />
                  To Date
                </label>
                <input
                  type="date"
                  value={filters.createdBefore || ""}
                  onChange={(e) =>
                    handleFilterChange(
                      "createdBefore",
                      e.target.value || undefined
                    )
                  }
                  className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-[#2ECC71] focus:border-[#2ECC71] transition-all outline-none text-sm text-[#1A1A40]"
                />
              </div>
            </div>

            {/* Reset Button */}
            <button
              onClick={handleReset}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-[#1A1A40] rounded-lg font-medium transition-all text-sm border-2 border-gray-200 cursor-pointer sm:mt-5"
            >
              <RotateCcw className="w-4 h-4" />
              Reset
            </button>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-4 bg-white rounded-lg shadow-sm border border-gray-200 px-6 py-3">
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
              security events
            </span>
            <span className="text-xs text-gray-500">
              Page {page} of {data?.pagination.totalPages}
            </span>
          </div>
        </div>

        {/* Security Activity Table */}
        <CriticalAuditLogTable logs={data?.data || []} />

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
