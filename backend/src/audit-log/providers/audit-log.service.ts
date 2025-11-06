// providers/audit-log.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';
import {
  AuditLog,
  AuditAction,
  AuditStatus,
} from '../entities/audit-log.entity';
import { User } from 'src/users/entities/user.entity';
import { PaginationService } from 'src/common/pagination/pagination.service';
import { QueryAuditLogsDto } from '../dto/audit-log-filter.dto';
import { PaginatedResponse } from 'src/common/pagination/interfaces/paginated-response.interface';
import { CRITICAL_USER_ACTIONS } from '../constants/audit-categories';

interface CreateAuditLogParams {
  action: AuditAction;
  status?: AuditStatus;
  userId?: string;
  targetUserId?: string;
  ipAddress?: string;
  userAgent?: string;
  metadata?: Record<string, any>;
  errorMessage?: string;
}

@Injectable()
export class AuditLogService {
  constructor(
    @InjectRepository(AuditLog)
    private readonly auditLogRepository: Repository<AuditLog>,
    private readonly paginationService: PaginationService,
  ) {}

  async createLog(params: CreateAuditLogParams): Promise<AuditLog> {
    const auditLog = this.auditLogRepository.create({
      ...params,
      status: params.status || AuditStatus.SUCCESS,
    });

    return await this.auditLogRepository.save(auditLog);
  }

  async getAuditLogs(
    queryDto: QueryAuditLogsDto,
  ): Promise<PaginatedResponse<AuditLog>> {
    const {
      page = 1,
      limit = 20,
      search,
      action,
      status,
      userId,
      targetUserId,
      ipAddress,
      sortBy = 'createdAt',
      sortOrder = 'DESC',
      createdAfter,
      createdBefore,
    } = queryDto;

    const queryBuilder = this.auditLogRepository
      .createQueryBuilder('audit_log')
      .leftJoinAndSelect('audit_log.user', 'user')
      .leftJoinAndSelect('audit_log.targetUser', 'targetUser')
      .select([
        'audit_log.id',
        'audit_log.action',
        'audit_log.status',
        'audit_log.userId',
        'audit_log.targetUserId',
        'audit_log.ipAddress',
        'audit_log.userAgent',
        'audit_log.metadata',
        'audit_log.errorMessage',
        'audit_log.createdAt',
        'user.id',
        'user.firstname',
        'user.lastname',
        'user.email',
        'targetUser.id',
        'targetUser.firstname',
        'targetUser.lastname',
        'targetUser.email',
      ]);

    // Apply base filters
    // this.paginationService.applyBaseFilters(
    //   queryBuilder,
    //   {
    //     search,
    //     searchFields: [
    //       'audit_log.action',
    //       'audit_log.ipAddress',
    //       'user.email',
    //       'user.firstname',
    //       'user.lastname',
    //       'targetUser.email',
    //       'targetUser.firstname',
    //       'targetUser.lastname',
    //     ],
    //     sortBy,
    //     sortOrder,
    //     createdAfter,
    //     createdBefore,
    //   },
    //   'audit_log',
    // );

    // Apply search filter with OR conditions and NULL handling
    if (search) {
      queryBuilder.andWhere(
        new Brackets((qb) => {
          qb.where('LOWER(audit_log.action) LIKE LOWER(:search)', {
            search: `%${search}%`,
          })
            .orWhere('LOWER(audit_log.ipAddress) LIKE LOWER(:search)', {
              search: `%${search}%`,
            })
            .orWhere('LOWER(user.email) LIKE LOWER(:search)', {
              search: `%${search}%`,
            })
            .orWhere('LOWER(user.firstname) LIKE LOWER(:search)', {
              search: `%${search}%`,
            })
            .orWhere('LOWER(user.lastname) LIKE LOWER(:search)', {
              search: `%${search}%`,
            })
            .orWhere('LOWER(targetUser.email) LIKE LOWER(:search)', {
              search: `%${search}%`,
            })
            .orWhere('LOWER(targetUser.firstname) LIKE LOWER(:search)', {
              search: `%${search}%`,
            })
            .orWhere('LOWER(targetUser.lastname) LIKE LOWER(:search)', {
              search: `%${search}%`,
            });
        }),
      );
    }

    // Apply date filters
    if (createdAfter) {
      queryBuilder.andWhere('audit_log.createdAt >= :createdAfter', {
        createdAfter,
      });
    }

    if (createdBefore) {
      queryBuilder.andWhere('audit_log.createdAt <= :createdBefore', {
        createdBefore,
      });
    }

    // Apply specific filters
    if (action) {
      queryBuilder.andWhere('audit_log.action = :action', { action });
    }

    if (status) {
      queryBuilder.andWhere('audit_log.status = :status', { status });
    }

    if (userId) {
      queryBuilder.andWhere('audit_log.userId = :userId', { userId });
    }

    if (targetUserId) {
      queryBuilder.andWhere('audit_log.targetUserId = :targetUserId', {
        targetUserId,
      });
    }

    if (ipAddress) {
      queryBuilder.andWhere('audit_log.ipAddress = :ipAddress', { ipAddress });
    }

    // Apply sorting
    const order = sortOrder === 'ASC' ? 'ASC' : 'DESC';
    queryBuilder.orderBy(`audit_log.${sortBy}`, order);

    return this.paginationService.paginate(queryBuilder, page, limit);
  }

  async getUserAuditLogs(
    userId: string,
    queryDto: QueryAuditLogsDto,
  ): Promise<PaginatedResponse<AuditLog>> {
    return this.getAuditLogs({ ...queryDto, userId });
  }

  async getAuditLogStats(userId?: string) {
    const baseQuery = this.auditLogRepository.createQueryBuilder('audit_log');

    if (userId) {
      baseQuery.where('audit_log.userId = :userId', { userId });
    }

    const [totalLogs, recentActivity, actionBreakdown] = await Promise.all([
      baseQuery.getCount(),
      baseQuery
        .clone()
        .andWhere('audit_log.createdAt >= :date', {
          date: new Date(Date.now() - 24 * 60 * 60 * 1000),
        })
        .getCount(),
      baseQuery
        .clone()
        .select('audit_log.action', 'action')
        .addSelect('COUNT(*)', 'count')
        .groupBy('audit_log.action')
        .getRawMany(),
    ]);

    return {
      totalLogs,
      last24Hours: recentActivity,
      actionBreakdown,
    };
  }

  async getUserCriticalAuditLogs(
    userId: string,
    queryDto: QueryAuditLogsDto,
  ): Promise<PaginatedResponse<AuditLog>> {
    const {
      page = 1,
      limit = 20,
      sortBy = 'createdAt',
      sortOrder = 'DESC',
      createdAfter,
      createdBefore,
    } = queryDto;

    const queryBuilder = this.auditLogRepository
      .createQueryBuilder('audit_log')
      .select([
        'audit_log.id',
        'audit_log.action',
        'audit_log.status',
        'audit_log.ipAddress',
        'audit_log.userAgent',
        'audit_log.metadata',
        'audit_log.createdAt',
      ])
      .where('audit_log.userId = :userId', { userId })
      .andWhere('audit_log.action IN (:...actions)', {
        actions: CRITICAL_USER_ACTIONS,
      });

    // Apply time-based filters
    if (createdAfter) {
      queryBuilder.andWhere('audit_log.createdAt >= :createdAfter', {
        createdAfter,
      });
    }

    if (createdBefore) {
      queryBuilder.andWhere('audit_log.createdAt <= :createdBefore', {
        createdBefore,
      });
    }

    // Apply sorting
    const order = sortOrder === 'ASC' ? 'ASC' : 'DESC';
    queryBuilder.orderBy(`audit_log.${sortBy}`, order);

    return this.paginationService.paginate(queryBuilder, page, limit);
  }
}
