// lib/constants/audit-labels.ts
import { AuditAction } from "../types/audit-log";

export const CRITICAL_ACTION_LABELS: Record<string, string> = {
  [AuditAction.USER_LOGIN]: "Logged in to your account",
  [AuditAction.USER_LOGOUT]: "Logged out of your account",
  [AuditAction.PASSWORD_RESET_REQUEST]: "Requested password reset",
  [AuditAction.PASSWORD_RESET_COMPLETE]: "Completed password reset",
  [AuditAction.PASSWORD_CHANGE]: "Changed password",
  [AuditAction.EMAIL_VERIFICATION_SENT]: "Email verification sent",
  [AuditAction.EMAIL_VERIFIED]: "Email verified successfully",
  [AuditAction.USER_PROFILE_UPDATE]: "Updated profile information",
  [AuditAction.USER_ACCOUNT_DELETE]: "Account deleted",
  [AuditAction.USER_DATA_EXPORT]: "Exported account data",
};

export const CRITICAL_ACTION_ICONS: Record<string, string> = {
  [AuditAction.USER_LOGIN]: "🔐",
  [AuditAction.USER_LOGOUT]: "🚪",
  [AuditAction.PASSWORD_RESET_REQUEST]: "🔑",
  [AuditAction.PASSWORD_RESET_COMPLETE]: "✅",
  [AuditAction.PASSWORD_CHANGE]: "🔒",
  [AuditAction.EMAIL_VERIFICATION_SENT]: "📧",
  [AuditAction.EMAIL_VERIFIED]: "✅",
  [AuditAction.USER_PROFILE_UPDATE]: "✏️",
  [AuditAction.USER_ACCOUNT_DELETE]: "🗑️",
  [AuditAction.USER_DATA_EXPORT]: "📤",
};
