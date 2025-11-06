// dto/audit-log-filter.dto.ts
import { IsOptional, IsEnum, IsUUID, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { BaseFilterDto } from 'src/common/pagination/dto/base-filter.dto';
import { AuditAction, AuditStatus } from '../entities/audit-log.entity';
import { PaginationDto } from 'src/common/pagination/dto/pagination.dto';

export class QueryAuditLogsDto extends PaginationDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  sortBy?: string = 'createdAt';

  @IsOptional()
  @IsEnum(['ASC', 'DESC'])
  sortOrder?: 'ASC' | 'DESC' = 'DESC';

  @IsOptional()
  @Type(() => Date)
  createdAfter?: Date;

  @IsOptional()
  @Type(() => Date)
  createdBefore?: Date;

  @IsOptional()
  @IsEnum(AuditAction)
  action?: AuditAction;

  @IsOptional()
  @IsEnum(AuditStatus)
  status?: AuditStatus;

  @IsOptional()
  @IsUUID()
  userId?: string;

  @IsOptional()
  @IsUUID()
  targetUserId?: string;

  @IsOptional()
  @IsString()
  ipAddress?: string;
}
