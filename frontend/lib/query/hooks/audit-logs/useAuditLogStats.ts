// lib/query/hooks/audit-logs/useAuditLogStats.ts
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient";
import { AuditLogStats } from "@/lib/types/audit-log";

export function useAuditLogStats() {
  return useQuery<AuditLogStats>({
    queryKey: ["audit-log-stats"],
    queryFn: async () => {
      return await apiClient.get<AuditLogStats>("/audit-logs/stats");
    },
  });
}
