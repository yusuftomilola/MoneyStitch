import { Injectable } from '@nestjs/common';
import { CreateUserDto } from 'src/users/dto/createUser.dto';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/providers/users.service';
import { LoginUserProvider } from './loginUser.provider';
import { Response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,

    private readonly loginUserProvider: LoginUserProvider,
  ) {}

  // CREATE USER
  public async createUser(createUserDto: CreateUserDto): Promise<User> {
    return await this.usersService.createUser(createUserDto);
  }

  // VALIDATE USER
  public async validateUser(
    email: string,
    password: string,
  ): Promise<Partial<User>> {
    return await this.usersService.validateUser(email, password);
  }

  // LOGIN USER
  public async loginUser(user: User, response: Response) {
    return await this.loginUserProvider.loginUser(user, response);
  }
}
