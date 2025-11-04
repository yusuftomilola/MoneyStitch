import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ErrorCatch } from 'utils/error';
import { PaginationService } from 'src/common/pagination/pagination.service';
import { QueryUsersDto } from '../dto/user-filter.dto';
import { PaginatedResponse } from 'src/common/pagination/interfaces/paginated-response.interface';

@Injectable()
export class GetUsersProvider {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly paginationService: PaginationService,
  ) {}

  public async getUsers(
    queryDto: QueryUsersDto,
  ): Promise<PaginatedResponse<User>> {
    const {
      page = 1,
      limit = 20,
      search,
      role,
      isEmailVerified,
      isActive,
      isSuspended,
      sortBy = 'createdAt',
      sortOrder = 'DESC',
      createdAfter,
      createdBefore,
    } = queryDto;

    // build base query
    const queryBuilder = this.usersRepository
      .createQueryBuilder('user')
      .select([
        'user.id',
        'user.firstname',
        'user.lastname',
        'user.username',
        'user.email',
        'user.role',
        'user.isEmailVerified',
        'user.isActive',
        'user.isSuspended',
        'user.createdAt',
        'user.updatedAt',
      ])
      .leftJoinAndSelect('user.profilePic', 'profilePic');

    // apply base filters (search, sort, dates)
    this.paginationService.applyBaseFilters(
      queryBuilder,
      {
        search,
        searchFields: [
          'user.firstname',
          'user.lastname',
          'user.email',
          'user.username',
        ],
        sortBy,
        sortOrder,
        createdAfter,
        createdBefore,
      },
      'user',
    );

    // apply entity-specific filters
    if (role) {
      queryBuilder.andWhere('user.role = :role', { role });
    }

    if (isEmailVerified !== undefined) {
      queryBuilder.andWhere('user.isEmailVerified = :isEmailVerified', {
        isEmailVerified,
      });
    }

    if (isActive !== undefined) {
      queryBuilder.andWhere('user.isActive = :isActive', { isActive });
    }

    if (isSuspended !== undefined) {
      queryBuilder.andWhere('user.isSuspended = :isSuspended', {
        isSuspended,
      });
    }

    // Use generic pagination
    return this.paginationService.paginate(queryBuilder, page, limit);

    // try {
    //   const users = await this.usersRepository.find();

    //   if (!users) {
    //     throw new NotFoundException('No users found');
    //   }

    //   return users;
    // } catch (error) {
    //   ErrorCatch(error, 'Error getting users');
    // }
  }
}
