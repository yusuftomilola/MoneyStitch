// audit-log/constants/audit-categories.ts
import { AuditAction } from '../entities/audit-log.entity';

export const CRITICAL_USER_ACTIONS: AuditAction[] = [
  // Authentication & Security
  AuditAction.USER_LOGIN,
  AuditAction.USER_LOGOUT,
  AuditAction.PASSWORD_RESET_REQUEST,
  AuditAction.PASSWORD_RESET_COMPLETE,
  AuditAction.PASSWORD_CHANGE,
  AuditAction.EMAIL_VERIFICATION_SENT,
  AuditAction.EMAIL_VERIFIED,

  // Account Management
  AuditAction.USER_PROFILE_UPDATE,
  AuditAction.USER_ACCOUNT_DELETE,
  AuditAction.USER_DATA_EXPORT,
];

export const isCriticalAction = (action: AuditAction): boolean => {
  return CRITICAL_USER_ACTIONS.includes(action);
};

export const CRITICAL_ACTION_LABELS: Record<AuditAction, string> = {
  [AuditAction.USER_LOGIN]: 'Logged in',
  [AuditAction.USER_LOGOUT]: 'Logged out',
  [AuditAction.PASSWORD_RESET_REQUEST]: 'Requested password reset',
  [AuditAction.PASSWORD_RESET_COMPLETE]: 'Password reset completed',
  [AuditAction.PASSWORD_CHANGE]: 'Changed password',
  [AuditAction.EMAIL_VERIFICATION_SENT]: 'Email verification sent',
  [AuditAction.EMAIL_VERIFIED]: 'Email verified',
  [AuditAction.USER_PROFILE_UPDATE]: 'Updated profile',
  [AuditAction.USER_ACCOUNT_DELETE]: 'Account deleted',
  [AuditAction.USER_DATA_EXPORT]: 'Exported data',
  // Add other actions for completeness
  [AuditAction.USER_PROFILE_VIEW]: 'Viewed profile',
  [AuditAction.USER_REGISTER]: 'Registered',
  [AuditAction.TOKEN_REFRESH]: 'Token refreshed',
  [AuditAction.ADMIN_USER_VIEW]: 'Admin viewed user',
  [AuditAction.ADMIN_USER_UPDATE]: 'Admin updated user',
  [AuditAction.ADMIN_USER_DELETE]: 'Admin deleted user',
  [AuditAction.ADMIN_USER_SUSPEND]: 'Admin suspended user',
  [AuditAction.ADMIN_USER_ACTIVATE]: 'Admin activated user',
  [AuditAction.ADMIN_USERS_LIST]: 'Admin viewed users list',
};
