// decorators/audit.decorator.ts
import { SetMetadata, UseInterceptors, applyDecorators } from '@nestjs/common';
import { AuditAction } from '../entities/audit-log.entity';
import { AuditLogInterceptor } from '../interceptors/audit-log.interceptor';

export const AUDIT_ACTION_KEY = 'audit_action';

export function Audit(action: AuditAction) {
  return applyDecorators(
    SetMetadata(AUDIT_ACTION_KEY, action),
    UseInterceptors(AuditLogInterceptor),
  );
}
