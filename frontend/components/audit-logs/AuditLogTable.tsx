// components/audit-logs/AuditLogTable.tsx
import { AuditLog, AuditAction, AuditStatus } from "@/lib/types/audit-log";
import { format } from "date-fns";
import {
  AlertCircle,
  CheckCircle,
  XCircle,
  User,
  Globe,
  Clock,
  Shield,
  Activity,
} from "lucide-react";

interface AuditLogTableProps {
  logs: AuditLog[];
}

export function AuditLogTable({ logs }: AuditLogTableProps) {
  const getActionIcon = (action: AuditAction) => {
    if (action.includes("ADMIN"))
      return <Shield className="w-4 h-4 text-[#F1C40F]" />;
    if (action.includes("LOGIN") || action.includes("LOGOUT"))
      return <Activity className="w-4 h-4 text-[#3498DB]" />;
    return <User className="w-4 h-4 text-[#2ECC71]" />;
  };

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

  const formatAction = (action: string) => {
    return action
      .split("_")
      .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
      .join(" ");
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
                User
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                Target
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                IP Address
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                Details
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
                    <div className="flex items-center gap-2">
                      {getActionIcon(log.action)}
                      <span className="text-sm font-medium text-[#1A1A40]">
                        {formatAction(log.action)}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {log.user ? (
                      <div className="text-sm">
                        <div className="font-medium text-gray-900">
                          {log.user.firstname} {log.user.lastname}
                        </div>
                        <div className="text-gray-500">{log.user.email}</div>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-400">System</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {log.targetUser ? (
                      <div className="text-sm">
                        <div className="font-medium text-gray-900">
                          {log.targetUser.firstname} {log.targetUser.lastname}
                        </div>
                        <div className="text-gray-500">
                          {log.targetUser.email}
                        </div>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-400">-</span>
                    )}
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
                    {log.errorMessage && (
                      <div
                        className="text-xs text-red-600 max-w-xs truncate"
                        title={log.errorMessage}
                      >
                        {log.errorMessage}
                      </div>
                    )}
                    {log.metadata && (
                      <details className="text-xs text-gray-500">
                        <summary className="cursor-pointer hover:text-[#2ECC71]">
                          View Details
                        </summary>
                        <pre className="mt-2 p-2 bg-gray-100 rounded text-xs overflow-auto max-w-xs">
                          {JSON.stringify(log.metadata, null, 2)}
                        </pre>
                      </details>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center justify-center gap-3">
                    <Activity className="w-16 h-16 text-gray-300" />
                    <div>
                      <p className="text-lg font-semibold text-gray-900">
                        No audit logs found
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        System activity will appear here
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
