// lib/types/audit-log.ts
export enum AuditAction {
  // Auth actions
  USER_LOGIN = "USER_LOGIN",
  USER_LOGOUT = "USER_LOGOUT",
  USER_REGISTER = "USER_REGISTER",
  PASSWORD_RESET_REQUEST = "PASSWORD_RESET_REQUEST",
  PASSWORD_RESET_COMPLETE = "PASSWORD_RESET_COMPLETE",
  PASSWORD_CHANGE = "PASSWORD_CHANGE",
  EMAIL_VERIFICATION_SENT = "EMAIL_VERIFICATION_SENT",
  EMAIL_VERIFIED = "EMAIL_VERIFIED",
  TOKEN_REFRESH = "TOKEN_REFRESH",

  // User actions
  USER_PROFILE_VIEW = "USER_PROFILE_VIEW",
  USER_PROFILE_UPDATE = "USER_PROFILE_UPDATE",
  USER_ACCOUNT_DELETE = "USER_ACCOUNT_DELETE",
  USER_DATA_EXPORT = "USER_DATA_EXPORT",

  // Admin actions
  ADMIN_USER_VIEW = "ADMIN_USER_VIEW",
  ADMIN_USER_UPDATE = "ADMIN_USER_UPDATE",
  ADMIN_USER_DELETE = "ADMIN_USER_DELETE",
  ADMIN_USER_SUSPEND = "ADMIN_USER_SUSPEND",
  ADMIN_USER_ACTIVATE = "ADMIN_USER_ACTIVATE",
  ADMIN_USERS_LIST = "ADMIN_USERS_LIST",
}

export enum AuditStatus {
  SUCCESS = "SUCCESS",
  FAILED = "FAILED",
  UNAUTHORIZED = "UNAUTHORIZED",
}

export interface AuditLog {
  id: string;
  action: AuditAction;
  status: AuditStatus;
  userId?: string;
  user?: {
    id: string;
    firstname: string;
    lastname: string;
    email: string;
  };
  targetUserId?: string;
  targetUser?: {
    id: string;
    firstname: string;
    lastname: string;
    email: string;
  };
  ipAddress?: string;
  userAgent?: string;
  metadata?: Record<string, any>;
  errorMessage?: string;
  createdAt: string;
}

export interface AuditLogFilters {
  search?: string;
  action?: AuditAction;
  status?: AuditStatus;
  userId?: string;
  targetUserId?: string;
  ipAddress?: string;
  sortBy?: string;
  sortOrder?: "ASC" | "DESC";
  createdAfter?: string;
  createdBefore?: string;
}

export interface AuditLogStats {
  totalLogs: number;
  last24Hours: number;
  actionBreakdown: Array<{
    action: string;
    count: number;
  }>;
}
