import { Type } from 'class-transformer';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class BaseFilterDto {
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
}
