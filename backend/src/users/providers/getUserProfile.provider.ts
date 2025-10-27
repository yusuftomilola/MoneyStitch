import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { User } from '../entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ErrorCatch } from 'src/common/helpers/errorCatch.util';

@Injectable()
export class GetUserProfileProvider {
  private readonly logger = new Logger(GetUserProfileProvider.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  public async getUserProfile(user: User): Promise<User> {
    try {
      const existingUser = await this.userRepository.findOne({
        where: {
          id: user.id,
        },
        relations: ['profilePic'],
      });

      if (!existingUser) {
        this.logger.error(`User ${user.id} was not found`);
        throw new NotFoundException('User not found');
      }

      this.logger.log(`Profile for user ${user.id} was successfully retrieved`);
      return existingUser;
    } catch (error) {
      this.logger.error('Failed to retrieve user profile', error);
      ErrorCatch(error, 'Failed to retrieve user profile');
    }
  }
}
