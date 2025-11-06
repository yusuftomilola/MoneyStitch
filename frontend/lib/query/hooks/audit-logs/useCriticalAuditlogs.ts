// lib/query/hooks/audit-logs/useCriticalAuditLogs.ts
import { PaginationParams } from "@/lib/types/common";
import { AuditLog } from "@/lib/types/audit-log";
import { usePaginatedQuery } from "../common/usePaginatedQuery";

export interface CriticalAuditLogFilters {
  createdAfter?: string;
  createdBefore?: string;
  sortBy?: string;
  sortOrder?: "ASC" | "DESC";
}

export function useCriticalAuditLogs(
  params: PaginationParams & CriticalAuditLogFilters
) {
  return usePaginatedQuery<AuditLog, CriticalAuditLogFilters>({
    endpoint: "/audit-logs/me/critical",
    queryKey: "critical-audit-logs",
    params,
  });
}
