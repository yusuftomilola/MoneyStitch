import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { ActivateUserResponse } from '../interfaces/responses';
import { ErrorCatch } from 'src/common/helpers/errorCatch.util';

@Injectable()
export class ActivateUserProvider {
  private readonly logger = new Logger(ActivateUserProvider.name);

  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  public async activateUser(id: string): Promise<ActivateUserResponse> {
    try {
      const user = await this.usersRepository.findOne({
        where: {
          id,
          isSuspended: true,
          isActive: false,
        },
      });

      if (!user) {
        this.logger.log(`User ${id} was not found in the database`);
        throw new NotFoundException('User not found');
      }

      user.isSuspended = false;
      user.isActive = true;

      await this.usersRepository.save(user);

      this.logger.log(`User ${id} was activated successfully`);
      return {
        status: 'Success',
        message: 'User activated successfully',
      };
    } catch (error) {
      this.logger.error(`Error activating user ${id}`);
      ErrorCatch(error, 'Failed to activate user');
    }
  }
}
