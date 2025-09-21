import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from '../dto/createUser.dto';
import { ErrorCatch } from 'utils/error';
import { HashingProvider } from 'src/auth/providers/hashing.provider';

@Injectable()
export class CreateUserProvider {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private readonly hashingProvider: HashingProvider,
  ) {}

  public async createUser(createUserDto: CreateUserDto): Promise<User> {
    try {
      const existingUser = await this.userRepository.findOne({
        where: {
          email: createUserDto.email,
        },
      });

      if (existingUser) {
        throw new ConflictException('User already exists.');
      }

      let password = await this.hashingProvider.hash(createUserDto.password);

      createUserDto.password = password;

      let user = this.userRepository.create(createUserDto);
      user = await this.userRepository.save(user);

      return user;
    } catch (error) {
      ErrorCatch(error, 'Failed to create user');
    }
  }
}
