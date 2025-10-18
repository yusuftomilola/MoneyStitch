// src/common/helpers/cookie.helper.ts
import { CookieOptions } from 'express';
import { ConfigService } from '@nestjs/config';

export class CookieHelper {
  static getRefreshTokenCookieOptions(
    configService: ConfigService,
    expiresAt: Date,
  ): CookieOptions {
    const isProduction = configService.get('NODE_ENV') === 'production';

    return {
      httpOnly: true,
      expires: expiresAt,
      path: '/api/v1/auth', // ← Changed back - more secure!
      ...(isProduction
        ? {
            // Production settings
            secure: true,
            sameSite: 'none',
            domain: '.yourdomain.com', // Your production domain
          }
        : {
            // Development settings (localhost)
            secure: false,
            sameSite: 'lax',
            // No domain specified for localhost
          }),
    };
  }

  static getClearCookieOptions(configService: ConfigService): CookieOptions {
    const isProduction = configService.get('NODE_ENV') === 'production';

    return {
      httpOnly: true,
      path: '/api/v1/auth', // ← Changed back - must match!
      ...(isProduction
        ? {
            secure: true,
            sameSite: 'none',
            domain: '.yourdomain.com',
          }
        : {
            secure: false,
            sameSite: 'lax',
          }),
    };
  }
}
