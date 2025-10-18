import { Injectable } from '@nestjs/common';
import { CreateUserDto } from 'src/users/dto/createUser.dto';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/providers/users.service';
import { LoginUserProvider } from './loginUser.provider';
import { Request, Response } from 'express';
import { AuthResponse } from '../interfaces/authResponse.interface';
import { RefreshTokensProvider } from './refreshTokens.provider';
import { RefreshTokenRepositoryOperations } from './RefreshTokenCrud.repository';
import { LogoutResponse } from '../interfaces/logout.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,

    private readonly loginUserProvider: LoginUserProvider,

    private readonly refreshTokensProvider: RefreshTokensProvider,

    private readonly refreshTokenRepositoryOperations: RefreshTokenRepositoryOperations,
  ) {}

  // CREATE USER
  public async createUser(
    createUserDto: CreateUserDto,
    response: Response,
  ): Promise<AuthResponse> {
    return await this.usersService.createUser(createUserDto, response);
  }

  // VALIDATE USER
  public async validateUser(
    email: string,
    password: string,
  ): Promise<Partial<User>> {
    return await this.usersService.validateUser(email, password);
  }

  // LOGIN USER
  public async loginUser(
    user: User,
    response: Response,
  ): Promise<AuthResponse> {
    return await this.loginUserProvider.loginUser(user, response);
  }

  // REFRESH TOKEN
  public async refreshToken(
    refreshToken: string,
    userId: string,
  ): Promise<AuthResponse> {
    return await this.refreshTokensProvider.refreshTokens(userId, refreshToken);
  }

  // LOG OUT
  public async logout(
    userId: string,
    refreshToken: string,
  ): Promise<LogoutResponse> {
    console.log('=== AUTH SERVICE LOGOUT ===');
    console.log('User ID:', userId);
    console.log(
      'Refresh token (first 20 chars):',
      refreshToken?.substring(0, 20),
    );

    // Don't catch errors here - let them bubble up to the controller
    // so we can see what's actually failing
    const result =
      await this.refreshTokenRepositoryOperations.revokeSingleRefreshToken(
        userId,
        refreshToken,
      );

    console.log('Revocation successful');
    return result;
  }
}
