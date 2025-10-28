import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from '../dto/createUser.dto';
import { ErrorCatch } from 'utils/error';
import { HashingProvider } from 'src/auth/providers/hashing.provider';
import { AuthResponse } from 'src/auth/interfaces/authResponse.interface';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { GenerateTokensProvider } from 'src/auth/providers/generateTokens.provider';
import { RefreshTokenRepositoryOperations } from 'src/auth/providers/RefreshTokenCrud.repository';
import { CookieHelper } from 'src/common/helpers/cookie.helper';
import { EmailService } from 'src/email/email.service';
import { EmailVerificationTokenProvider } from './emailVerificationToken.provider';

@Injectable()
export class CreateUserProvider {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private readonly hashingProvider: HashingProvider,

    private readonly configService: ConfigService,

    private readonly generateTokensProvider: GenerateTokensProvider,

    private readonly refreshTokenRepositoryOperations: RefreshTokenRepositoryOperations,

    private readonly emailService: EmailService,

    private readonly emailVerificationTokenProvider: EmailVerificationTokenProvider,
  ) {}

  public async createUser(
    createUserDto: CreateUserDto,
    response: Response,
  ): Promise<AuthResponse> {
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

      // clear any existing cookie first to make room for new cookie
      const clearOptions = CookieHelper.getClearCookieOptions(
        this.configService,
      );
      response.clearCookie('authRefreshToken', clearOptions);

      // generate tokens
      const { accessToken, refreshToken } =
        await this.generateTokensProvider.generateBothTokens(user);

      await this.refreshTokenRepositoryOperations.saveRefreshToken(
        user,
        refreshToken,
      );

      // send verification email
      const plainEmailVerificationToken =
        await this.emailVerificationTokenProvider.getEmailVerificationToken(
          user,
        );

      await this.emailService.sendVerificationEmail(
        user,
        plainEmailVerificationToken,
      );

      // save refresh token in client cookie
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
    } catch (error) {
      ErrorCatch(error, 'Failed to create user');
    }
  }
}
