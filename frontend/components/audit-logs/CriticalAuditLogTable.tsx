// components/audit-logs/CriticalAuditLogTable.tsx
import { AuditLog, AuditStatus } from "@/lib/types/audit-log";
import { format } from "date-fns";
import {
  CheckCircle,
  XCircle,
  AlertCircle,
  Globe,
  Clock,
  Activity,
  Monitor,
} from "lucide-react";
import { CRITICAL_ACTION_LABELS } from "@/lib/constants/audit-labels";

interface CriticalAuditLogTableProps {
  logs: AuditLog[];
}

export function CriticalAuditLogTable({ logs }: CriticalAuditLogTableProps) {
  const getStatusIcon = (status: AuditStatus) => {
    switch (status) {
      case AuditStatus.SUCCESS:
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case AuditStatus.FAILED:
        return <XCircle className="w-4 h-4 text-red-500" />;
      case AuditStatus.UNAUTHORIZED:
        return <AlertCircle className="w-4 h-4 text-yellow-500" />;
    }
  };

  const getDeviceInfo = (userAgent?: string) => {
    if (!userAgent) return "Unknown";
    if (userAgent.includes("Mobile")) return "Mobile";
    if (userAgent.includes("Windows")) return "Windows";
    if (userAgent.includes("Mac")) return "Mac";
    if (userAgent.includes("Linux")) return "Linux";
    return "Unknown";
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-[#1A1A40] to-[#2a2a60] text-white">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                Timestamp
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                Action
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                IP Address
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                Device
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {logs.length > 0 ? (
              logs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2 text-sm text-gray-900">
                      <Clock className="w-4 h-4 text-gray-400" />
                      {format(new Date(log.createdAt), "MMM dd, yyyy HH:mm:ss")}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-medium text-[#1A1A40]">
                      {CRITICAL_ACTION_LABELS[log.action] || log.action}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5">
                      {getStatusIcon(log.status)}
                      <span
                        className={`text-sm font-medium ${
                          log.status === AuditStatus.SUCCESS
                            ? "text-green-700"
                            : log.status === AuditStatus.FAILED
                              ? "text-red-700"
                              : "text-yellow-700"
                        }`}
                      >
                        {log.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {log.ipAddress ? (
                      <div className="flex items-center gap-1.5 text-sm text-gray-700">
                        <Globe className="w-4 h-4 text-gray-400" />
                        {log.ipAddress}
                      </div>
                    ) : (
                      <span className="text-sm text-gray-400">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {log.userAgent ? (
                      <div className="flex items-center gap-1.5 text-sm text-gray-700">
                        <Monitor className="w-4 h-4 text-gray-400" />
                        {getDeviceInfo(log.userAgent)}
                      </div>
                    ) : (
                      <span className="text-sm text-gray-400">-</span>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center justify-center gap-3">
                    <Activity className="w-16 h-16 text-gray-300" />
                    <div>
                      <p className="text-lg font-semibold text-gray-900">
                        No security activity found
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        Your security events will appear here
                      </p>
                    </div>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
