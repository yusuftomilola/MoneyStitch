import { Injectable } from '@nestjs/common';
import { User } from '../../users/entities/user.entity';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { GenerateTokensProvider } from './generateTokens.provider';
import { RefreshTokenRepositoryOperations } from './RefreshTokenCrud.repository';
import { AuthResponse } from '../interfaces/authResponse.interface';
import { CookieHelper } from 'src/common/helpers/cookie.helper';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class LoginUserProvider {
  constructor(
    private readonly configService: ConfigService,

    private readonly generateTokensProvider: GenerateTokensProvider,

    private readonly refreshTokenRepositoryOperations: RefreshTokenRepositoryOperations,

    private readonly jwtService: JwtService,
  ) {}

  public async loginUser(
    user: User,
    response: Response,
  ): Promise<AuthResponse> {
    // Clear any existing cookie first
    const clearOptions = CookieHelper.getClearCookieOptions(this.configService);
    response.clearCookie('authRefreshToken', clearOptions);

    const { accessToken, refreshToken } =
      await this.generateTokensProvider.generateBothTokens(user);

    console.log('=== SAVING NEW REFRESH TOKEN ===');
    console.log('User ID:', user.id);
    console.log(
      'New refresh token (first 20 chars):',
      refreshToken.substring(0, 20),
    );

    const savedToken =
      await this.refreshTokenRepositoryOperations.saveRefreshToken(
        user,
        refreshToken,
      );

    console.log('Saved token ID:', savedToken.id);
    console.log('Saved token revoked?:', savedToken.revoked);
    console.log('Saved token created at:', savedToken.createdAt);

    const jwtExpirationMs = parseInt(
      this.configService.get<string>('JWT_REFRESH_EXPIRATION') || '604800000',
    );
    const expires = new Date(Date.now() + jwtExpirationMs);

    const cookieOptions = CookieHelper.getRefreshTokenCookieOptions(
      this.configService,
      expires,
    );

    response.cookie('authRefreshToken', refreshToken, cookieOptions);

    return { user, accessToken };
  }

  public verifyToken(jwt: string) {
    this.jwtService.verify(jwt);
  }
}
