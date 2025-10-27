import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { FindOneUserByIdProvider } from './findOneUserById.provider';
import { DeleteUserResponse } from '../interfaces/responses';
import { ErrorCatch } from 'src/common/helpers/errorCatch.util';

@Injectable()
export class DeleteUserProvider {
  private readonly logger = new Logger(DeleteUserProvider.name);

  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,

    private readonly findOneUserByIdProvider: FindOneUserByIdProvider,
  ) {}

  public async deleteUser(id: string): Promise<DeleteUserResponse> {
    try {
      const result = await this.usersRepository.delete(id);

      if (result.affected === 0) {
        return {
          status: 'Failed',
          message: 'User not found or already deleted',
        };
      }

      this.logger.log(`User ${id} deleted successfully`);
      return {
        status: 'Success',
        message: 'User deleted successfully',
      };
    } catch (error) {
      this.logger.error(`Error deleting user ${id}`);
      ErrorCatch(error, 'Failed to delete user');
    }
  }
}
