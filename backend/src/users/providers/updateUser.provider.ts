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
      const user = await this.usersRepository.findOne({
        where: { id },
        relations: ['profilePic'],
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      // if user is updating their password, hash it
      if (updateUserDto.password) {
        try {
          updateUserDto.password = await this.hashingProvider.hash(
            updateUserDto.password,
          );
        } catch (error) {
          this.logger.error(`Could not hash password for user ${user.id}`);
          throw new Error(error);
        }
      }

      // update the user object with the updated details
      Object.assign(user, updateUserDto);

      // save the updated details to the database

      await this.usersRepository.save(user);

      this.logger.log(`User ${user.id} was successfully updated`);

      return {
        status: 'Success',
        message: 'User updated sucessfully',
      };
    } catch (error) {
      this.logger.error('Failed to update user', error);
      ErrorCatch(error, 'Failed to update user');
    }
  }
}
