// src/common/pagination/pagination.service.ts
import { SelectQueryBuilder } from 'typeorm';
import {
  PaginatedResponse,
  PaginationMeta,
} from './interfaces/paginated-response.interface';

export class PaginationService {
  async paginate<T>(
    queryBuilder: SelectQueryBuilder<T>,
    page: number = 1,
    limit: number = 2,
  ): Promise<PaginatedResponse<T>> {
    const skip = (page - 1) * limit;
    queryBuilder.skip(skip).take(limit);
    const [data, total] = await queryBuilder.getManyAndCount();
    const pagination: PaginationMeta = {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasNextPage: page < Math.ceil(total / limit),
      hasPreviousPage: page > 1,
    };
    return { data, pagination };
  }

  applyBaseFilters<T>(
    queryBuilder: SelectQueryBuilder<T>,
    filters: {
      search?: string;
      searchFields?: string[];
      sortBy?: string;
      sortOrder?: 'ASC' | 'DESC';
      createdAfter?: Date;
      createdBefore?: Date;
    },
    alias: string,
  ): SelectQueryBuilder<T> {
    const {
      search,
      searchFields,
      sortBy = 'createdAt',
      sortOrder = 'DESC',
      createdAfter,
      createdBefore,
    } = filters;

    // Search across multiple fields - FIX: Proper parentheses and OR conditions
    if (search && searchFields && searchFields.length > 0) {
      const searchConditions = searchFields
        .map((field) => `${field} ILIKE :search`)
        .join(' OR '); // Added space before OR
      queryBuilder.andWhere(`(${searchConditions})`, {
        // Fixed: proper parentheses
        search: `%${search}%`, // Fixed: added second %
      });
    }

    // Sorting - FIX: Proper method call
    queryBuilder.orderBy(`${alias}.${sortBy}`, sortOrder); // Fixed: proper method syntax

    // Date range filters - FIX: Proper method calls
    if (createdAfter) {
      queryBuilder.andWhere(`${alias}.createdAt >= :createdAfter`, {
        // Fixed: proper method syntax
        createdAfter,
      });
    }

    if (createdBefore) {
      queryBuilder.andWhere(`${alias}.createdAt <= :createdBefore`, {
        // Fixed: proper method syntax
        createdBefore,
      });
    }

    return queryBuilder;
  }
}
