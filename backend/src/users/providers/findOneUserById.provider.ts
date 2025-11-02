import {
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { ErrorCatch } from 'utils/error';

@Injectable()
export class FindOneUserByIdProvider {
  private readonly logger = new Logger(FindOneUserByIdProvider.name);

  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  public async getUser(userId: string): Promise<User> {
    try {
      const user = await this.usersRepository.findOne({
        where: {
          id: userId,
        },
      });

      if (!user) {
        this.logger.error(`User ${userId} was not found in the database`);
        throw new NotFoundException('User not found');
      }

      this.logger.log(`User ${userId} was retrieved succesfully`);
      return user;
    } catch (error) {
      // Don't catch NotFoundException here, let it bubble up
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Failed to get user ${userId} `);
      ErrorCatch(error, 'Error retrieving user details');
    }
  }
}
