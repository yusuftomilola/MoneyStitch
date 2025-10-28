import {
  Injectable,
  RequestTimeoutException,
  UnauthorizedException,
} from '@nestjs/common';
import { RefreshToken } from '../entities/refreshToken.entity';
import { HashingProvider } from './hashing.provider';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class FindOneRefreshTokenProvider {
  constructor(
    @InjectRepository(RefreshToken)
    private readonly refreshTokenEntity: Repository<RefreshToken>,
    private readonly hashingProvider: HashingProvider,
  ) {}

  public async findRefreshToken(
    userId: string,
    userRefreshToken: string,
    allowRevoked: boolean = false, // New parameter
  ) {
    let userTokens: RefreshToken[];

    try {
      userTokens = await this.refreshTokenEntity.find({
        where: {
          user: {
            id: userId,
          },
        },
        relations: ['user'],
        order: {
          createdAt: 'DESC', // Get newest tokens first
        },
      });
    } catch (error) {
      throw new RequestTimeoutException('Error connecting to the database');
    }

    if (!userTokens || userTokens.length === 0) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    // compare provided token with each stored one
    let matchedToken: RefreshToken | null = null;

    for (const tokenEntity of userTokens) {
      const isMatch = await this.hashingProvider.compare(
        userRefreshToken,
        tokenEntity.token,
      );

      if (isMatch) {
        matchedToken = tokenEntity;

        // If we found a non-revoked match, use it immediately
        if (!tokenEntity.revoked) {
          console.log('Found valid non-revoked token:', tokenEntity.id);
          return tokenEntity;
        }

        // If revoked but we allow it, continue to find potential newer match
        if (allowRevoked) {
          console.log(
            'Found revoked token, but continuing search:',
            tokenEntity.id,
          );
          continue;
        }

        // Found revoked token and not allowed
        console.log('Found revoked token:', tokenEntity.id);
        throw new UnauthorizedException('Refresh token is already revoked');
      }
    }

    // If we get here with a matched token (only possible if allowRevoked=true)
    if (matchedToken) {
      return matchedToken;
    }

    throw new UnauthorizedException('Invalid refresh token');
  }
}
