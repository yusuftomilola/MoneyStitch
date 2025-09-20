import { Injectable } from '@nestjs/common';
import { CreateUserProvider } from './createUser.provider';
import { CreateUserDto } from '../dto/createUser.dto';
import { User } from '../entities/user.entity';

@Injectable()
export class UsersService {
  constructor(private readonly createUserProvider: CreateUserProvider) {}

  //CREATE USER
  public async createUser(createUserDto: CreateUserDto): Promise<User> {
    return await this.createUserProvider.createUser(createUserDto);
  }
}
