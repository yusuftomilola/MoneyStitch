// lib/query/hooks/audit-logs/useAuditLogs.ts
import { PaginationParams } from "@/lib/types/common";
import { AuditLogFilters, AuditLog } from "@/lib/types/audit-log";
import { usePaginatedQuery } from "../common/usePaginatedQuery";

export function useAuditLogs(params: PaginationParams & AuditLogFilters) {
  return usePaginatedQuery<AuditLog, AuditLogFilters>({
    endpoint: "/audit-logs",
    queryKey: "audit-logs",
    params,
  });
}
