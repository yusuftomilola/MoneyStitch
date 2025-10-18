import { Injectable } from '@nestjs/common';
import { User } from '../../users/entities/user.entity';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { GenerateTokensProvider } from './generateTokens.provider';
import { RefreshTokenRepositoryOperations } from './RefreshTokenCrud.repository';
import { AuthResponse } from '../interfaces/authResponse.interface';
import { CookieHelper } from 'src/common/helpers/cookie.helper';

@Injectable()
export class LoginUserProvider {
  constructor(
    private readonly configService: ConfigService,

    private readonly generateTokensProvider: GenerateTokensProvider,

    private readonly refreshTokenRepositoryOperations: RefreshTokenRepositoryOperations,
  ) {}

  public async loginUser(
    user: User,
    response: Response,
  ): Promise<AuthResponse> {
    const { accessToken, refreshToken } =
      await this.generateTokensProvider.generateBothTokens(user);

    await this.refreshTokenRepositoryOperations.saveRefreshToken(
      user,
      refreshToken,
    );

    const jwtExpirationMs = parseInt(
      this.configService.get<string>('JWT_REFRESH_EXPIRATION') || '604800000',
    ); // 7 DAYS in milliseconds
    const expires = new Date(Date.now() + jwtExpirationMs);

    // use environment-aware cookie settings
    const cookieOptions = CookieHelper.getRefreshTokenCookieOptions(
      this.configService,
      expires,
    );

    response.cookie('authRefreshToken', refreshToken, cookieOptions);

    return { user, accessToken };
  }
}
