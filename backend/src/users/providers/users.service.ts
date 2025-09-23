import { Injectable } from '@nestjs/common';
import { CreateUserProvider } from './createUser.provider';
import { CreateUserDto } from '../dto/createUser.dto';
import { User } from '../entities/user.entity';
import { FindOneUserByIdProvider } from './findOneUserById.provider';
import { FindOneUserByEmailProvider } from './findOneUserByEmail.provider';
import { ValidateUserProvider } from './validateUser.provider';
import { GetUsersProvider } from './getusers.provider';
import { Response } from 'express';
import { AuthResponse } from 'src/auth/interfaces/authResponse.interface';

@Injectable()
export class UsersService {
  constructor(
    private readonly createUserProvider: CreateUserProvider,
    private readonly findOneUserByIdProvider: FindOneUserByIdProvider,
    private readonly findOneUserByEmailProvider: FindOneUserByEmailProvider,
    private readonly validateUserProvider: ValidateUserProvider,
    private readonly getusersProvider: GetUsersProvider,
  ) {}

  // FIND USER BY ID
  public async findUserById(id: string): Promise<User> {
    return await this.findOneUserByIdProvider.getUser(id);
  }

  // FIND USER BY EMAIL
  public async findUserByEmail(email: string): Promise<User> {
    return await this.findOneUserByEmailProvider.getUser(email);
  }

  // CREATE USER
  public async createUser(
    createUserDto: CreateUserDto,
    response: Response,
  ): Promise<AuthResponse> {
    return await this.createUserProvider.createUser(createUserDto, response);
  }

  // VALIDATE USER
  public async validateUser(
    email: string,
    password: string,
  ): Promise<Partial<User>> {
    return await this.validateUserProvider.validateUser(email, password);
  }

  // GET ALL USERS
  public async getUsers(): Promise<User[]> {
    return await this.getusersProvider.getUsers();
  }
}
