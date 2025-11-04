import { IsBoolean, IsEnum, IsOptional } from 'class-validator';
import { BaseFilterDto } from 'src/common/pagination/dto/base-filter.dto';
import { UserRole } from '../enums/userRoles.enum';
import { Type } from 'class-transformer';
import { IntersectionType } from '@nestjs/swagger';
import { PaginationDto } from 'src/common/pagination/dto/pagination.dto';

export class UserFilterDto extends BaseFilterDto {
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;

  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  isEmailVerified?: boolean;

  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  isSuspended?: boolean;
}

export class QueryUsersDto extends IntersectionType(
  PaginationDto,
  UserFilterDto,
) {}
