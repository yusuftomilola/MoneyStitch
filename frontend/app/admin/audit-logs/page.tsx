// pages/admin/audit-logs.tsx
"use client";
import { useState } from "react";
import { useAuditLogs } from "@/lib/query/hooks/audit-logs/useAuditLogs";
import { useAuditLogStats } from "@/lib/query/hooks/audit-logs/useAuditLogStats";
import { AuditLogFilters } from "@/components/audit-logs/AuditLogFilters";
import { AuditLogTable } from "@/components/audit-logs/AuditLogTable";
import { Pagination } from "@/components/common/Pagination";
import { AuditLogFilters as AuditLogFiltersType } from "@/lib/types/audit-log";
import { Activity, Shield, TrendingUp, Clock } from "lucide-react";

export default function AuditLogsPage() {
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [filters, setFilters] = useState<AuditLogFiltersType>({
    sortBy: "createdAt",
    sortOrder: "DESC",
  });

  const { data, isLoading, isError } = useAuditLogs({
    page,
    limit,
    ...filters,
  });

  const { data: stats } = useAuditLogStats();

  const handleFiltersChange = (newFilters: AuditLogFiltersType) => {
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-[#2ECC71] border-t-transparent"></div>
          <p className="mt-4 text-[#1A1A40] font-medium">
            Loading audit logs...
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
              Error Loading Audit Logs
            </h3>
            <p className="text-gray-600">
              Unable to fetch audit logs. Please try again later.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3">
            <Shield className="w-8 h-8 text-[#2ECC71]" />
            <div>
              <h1 className="text-3xl font-bold text-[#1A1A40]">Audit Logs</h1>
              <p className="text-sm text-gray-600">
                Track and monitor all system activities
              </p>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Logs
                  </p>
                  <p className="text-2xl font-bold text-[#1A1A40]">
                    {stats.totalLogs.toLocaleString()}
                  </p>
                </div>
                <Activity className="w-8 h-8 text-[#2ECC71]" />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Last 24 Hours
                  </p>
                  <p className="text-2xl font-bold text-[#1A1A40]">
                    {stats.last24Hours.toLocaleString()}
                  </p>
                </div>
                <Clock className="w-8 h-8 text-[#3498DB]" />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Most Common Action
                  </p>
                  <p className="text-lg font-bold text-[#1A1A40]">
                    {stats.actionBreakdown[0]?.action.split("_").join(" ") ||
                      "N/A"}
                  </p>
                </div>
                <TrendingUp className="w-8 h-8 text-[#F1C40F]" />
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="mb-4">
          <AuditLogFilters
            filters={filters}
            onFiltersChange={handleFiltersChange}
            onReset={handleResetFilters}
          />
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
              logs
            </span>
            <span className="text-xs text-gray-500">
              Page {page} of {data?.pagination.totalPages}
            </span>
          </div>
        </div>

        {/* Audit Logs Table */}
        <AuditLogTable logs={data?.data || []} />

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
