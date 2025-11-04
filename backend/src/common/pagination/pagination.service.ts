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

    // Search across multiple fields
    if (search && searchFields && searchFields.length > 0) {
      const searchConditions = searchFields
        .map((field) => `${field} ILIKE :search`)
        .join('OR');
      queryBuilder.andWhere(`(${searchConditions})`, {
        search: `%${search}`,
      });
    }

    //sorting
    queryBuilder.orderBy(`${alias}.${sortBy}`, sortOrder);

    // Date range filters
    if (createdAfter) {
      queryBuilder.andWhere(`${alias}.createdAt >= :createdAfter`, {
        createdAfter,
      });
    }

    if (createdBefore) {
      queryBuilder.andWhere(`${alias}.createdAt <= :createdBefore`, {
        createdBefore,
      });
    }

    return queryBuilder;
  }
}
