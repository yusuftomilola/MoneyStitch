import { Injectable } from '@nestjs/common';
import { User } from '../../users/entities/user.entity';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { TokenPayload } from '../interfaces/tokenPayload.interface';

@Injectable()
export class LoginUserProvider {
  constructor(
    private readonly configService: ConfigService,

    private readonly jwtService: JwtService,
  ) {}

  public async loginUser(user: User, response: Response) {
    const jwtExpirationMs = parseInt(
      this.configService.get<string>('JWT_EXPIRATION') || '3600000',
    ); // 1 HOUR in milliseconds

    const expires = new Date(Date.now() + jwtExpirationMs);

    const tokenPayload: TokenPayload = {
      userId: user.id,
    };

    const token = this.jwtService.sign(tokenPayload);

    console.log(token);

    response.cookie('authToken', token, {
      secure: true,
      httpOnly: true,
      expires,
    });

    return { user, token };
  }
}
