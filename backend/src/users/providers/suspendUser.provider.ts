import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { FindOneUserByIdProvider } from './findOneUserById.provider';
import { SuspendUserResponse } from '../interfaces/responses';
import { ErrorCatch } from 'src/common/helpers/errorCatch.util';

@Injectable()
export class SuspendUserProvider {
  private readonly logger = new Logger(SuspendUserProvider.name);

  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,

    private readonly findOneUserByIdProvider: FindOneUserByIdProvider,
  ) {}

  public async suspendUser(id: string): Promise<SuspendUserResponse> {
    try {
      const user = await this.usersRepository.findOne({
        where: {
          id,
          isSuspended: false,
          isActive: true,
        },
      });

      if (!user) {
        this.logger.log(`User ${id} was not found in the database`);
        throw new NotFoundException('User not found');
      }

      user.isSuspended = true;
      user.isActive = false;

      await this.usersRepository.save(user);

      this.logger.log(`User ${id} suspended successfully`);
      return {
        status: 'Success',
        message: 'User suspended successfully',
      };
    } catch (error) {
      this.logger.error(`Error suspending user ${id}`);
      ErrorCatch(error, 'Failed to suspend user');
    }
  }
}
