// interceptors/audit-log.interceptor.ts
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { Reflector } from '@nestjs/core';
import { AuditLogService } from '../providers/audit-log.service';
import { AuditAction, AuditStatus } from '../entities/audit-log.entity';
import { AUDIT_ACTION_KEY } from '../decorators/audit.decorator';

@Injectable()
export class AuditLogInterceptor implements NestInterceptor {
  constructor(
    private readonly auditLogService: AuditLogService,
    private readonly reflector: Reflector,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const handler = context.getHandler();

    // Get the audit action from metadata
    const action = this.reflector.get<AuditAction>(AUDIT_ACTION_KEY, handler);

    // If no action is set, skip audit logging
    if (!action) {
      return next.handle();
    }

    const user = request.user;
    const targetUserId = request.params?.id;
    const ipAddress = request.ip || request.connection?.remoteAddress;
    const userAgent = request.headers['user-agent'];

    return next.handle().pipe(
      tap(async () => {
        await this.auditLogService.createLog({
          action,
          status: AuditStatus.SUCCESS,
          userId: user?.id,
          targetUserId,
          ipAddress,
          userAgent,
          metadata: {
            method: request.method,
            path: request.path,
            query: request.query,
            body: request.method !== 'GET' ? request.body : undefined,
          },
        });
      }),
      catchError(async (error) => {
        await this.auditLogService.createLog({
          action,
          status:
            error.status === 401
              ? AuditStatus.UNAUTHORIZED
              : AuditStatus.FAILED,
          userId: user?.id,
          targetUserId,
          ipAddress,
          userAgent,
          errorMessage: error.message,
          metadata: {
            method: request.method,
            path: request.path,
            query: request.query,
            body: request.method !== 'GET' ? request.body : undefined,
            statusCode: error.status,
          },
        });
        return throwError(() => error);
      }),
    );
  }
}
