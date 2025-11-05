import { IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator';
import { BaseFilterDto } from 'src/common/pagination/dto/base-filter.dto';
import { UserRole } from '../enums/userRoles.enum';
import { Transform, Type } from 'class-transformer';
import { IntersectionType } from '@nestjs/swagger';
import { PaginationDto } from 'src/common/pagination/dto/pagination.dto';

export class QueryUsersDto extends PaginationDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  sortBy?: string;

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
  @IsEnum(UserRole)
  role?: UserRole;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  isEmailVerified?: boolean;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  isActive?: boolean;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  isSuspended?: boolean;
}
