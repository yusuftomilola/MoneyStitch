// controllers/audit-log.controller.ts
import {
  Controller,
  Get,
  Query,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AuditLogService } from '../providers/audit-log.service';
import { QueryAuditLogsDto } from '../dto/audit-log-filter.dto';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRole } from 'src/users/enums/userRoles.enum';
import { GetCurrentUser } from 'src/auth/decorators/getCurrentUser.decorator';
import { User } from 'src/users/entities/user.entity';
import { PaginatedResponse } from 'src/common/pagination/interfaces/paginated-response.interface';
import { AuditLog } from '../entities/audit-log.entity';
import { CRITICAL_USER_ACTIONS } from '../constants/audit-categories';

@Controller('api/v1/audit-logs')
export class AuditLogController {
  constructor(private readonly auditLogService: AuditLogService) {}

  // Get all audit logs - Admin only
  @Get()
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.OK)
  async getAuditLogs(
    @Query() queryDto: QueryAuditLogsDto,
  ): Promise<PaginatedResponse<AuditLog>> {
    return await this.auditLogService.getAuditLogs(queryDto);
  }

  // Get audit log statistics - Admin only
  @Get('stats')
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.OK)
  async getAuditStats() {
    return await this.auditLogService.getAuditLogStats();
  }

  // Get current user's audit logs
  @Get('me')
  @HttpCode(HttpStatus.OK)
  async getMyAuditLogs(
    @GetCurrentUser() user: User,
    @Query() queryDto: QueryAuditLogsDto,
  ): Promise<PaginatedResponse<AuditLog>> {
    return await this.auditLogService.getUserAuditLogs(user.id, queryDto);
  }

  // Get specific user's audit logs - Admin only
  @Get('user/:userId')
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.OK)
  async getUserAuditLogs(
    @Param('userId') userId: string,
    @Query() queryDto: QueryAuditLogsDto,
  ): Promise<PaginatedResponse<AuditLog>> {
    return await this.auditLogService.getUserAuditLogs(userId, queryDto);
  }

  @Get('me/critical')
  @HttpCode(HttpStatus.OK)
  async getMyCriticalAuditLogs(
    @GetCurrentUser() user: User,
    @Query() queryDto: QueryAuditLogsDto,
  ): Promise<PaginatedResponse<AuditLog>> {
    return await this.auditLogService.getUserCriticalAuditLogs(
      user.id,
      queryDto,
    );
  }

  // Optional: Get critical action types
  @Get('critical-actions')
  @HttpCode(HttpStatus.OK)
  async getCriticalActions() {
    return {
      actions: CRITICAL_USER_ACTIONS,
    };
  }
}
