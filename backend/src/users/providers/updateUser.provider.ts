import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  RequestTimeoutException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { HashingProvider } from 'src/auth/providers/hashing.provider';
import { UpdateUserDto } from '../dto/updateUser.dto';
import { FindOneUserByIdProvider } from './findOneUserById.provider';
import { UpdateUserResponse } from '../interfaces/responses';
import { ErrorCatch } from 'src/common/helpers/errorCatch.util';

@Injectable()
export class UpdateUserProvider {
  private readonly logger = new Logger(UpdateUserProvider.name);

  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly hashingProvider: HashingProvider,
    private readonly findOneUserByIdProvider: FindOneUserByIdProvider,
  ) {}

  public async updateOneUser(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UpdateUserResponse> {
    try {
      // check if user exists
      const existingUser = await this.usersRepository.findOne({
        where: { id },
        relations: ['profilePic'],
      });

      if (!existingUser) {
        throw new NotFoundException('User not found');
      }

      // if user is updating their password, hash it
      if (updateUserDto.password) {
        try {
          updateUserDto.password = await this.hashingProvider.hash(
            updateUserDto.password,
          );
        } catch (error) {
          this.logger.error(`Could not hash password for user ${id}`);
          throw new Error(error);
        }
      }

      // Use preload to properly merge the updates with the existing entity
      const userToUpdate = await this.usersRepository.preload({
        id: id,
        ...updateUserDto,
      });

      if (!userToUpdate) {
        throw new NotFoundException('User not found');
      }

      // save the updated user
      const updatedUser = await this.usersRepository.save(userToUpdate);

      // Explicitly fetch the updated user with relations to ensure we get the correct data
      const finalUser = await this.usersRepository.findOne({
        where: { id: updatedUser.id },
        relations: ['profilePic'],
      });

      this.logger.log(`User ${id} was successfully updated`);

      return {
        status: 'Success',
        message: 'User updated successfully',
        user: finalUser,
      };
    } catch (error) {
      this.logger.error('Failed to update user', error);
      ErrorCatch(error, 'Failed to update user');
    }
  }
}
