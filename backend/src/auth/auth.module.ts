import { forwardRef, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './providers/auth.service';
import { UsersModule } from 'src/users/users.module';
import { HashingProvider } from './providers/hashing.provider';
import { BcryptProvider } from './providers/bcrypt.provider';
import { LocalStrategy } from './strategies/local.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { LoginUserProvider } from './providers/loginUser.provider';
import { JwtStrategy } from './strategies/jwt.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RefreshToken } from './entities/refreshToken.entity';
import { JwtRefreshStrategy } from './strategies/jwtRefresh.strategy';
import { RefreshTokenRepositoryOperations } from './providers/RefreshTokenCrud.repository';
import { RefreshTokensProvider } from './providers/refreshTokens.provider';
import { FindOneRefreshTokenProvider } from './providers/findOneRefreshToken.provider';
import { GenerateTokensProvider } from './providers/generateTokens.provider';

@Module({
  imports: [
    forwardRef(() => UsersModule),
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get('JWT_ACCESS_EXPIRATION'),
        },
      }),
    }),
    TypeOrmModule.forFeature([RefreshToken]),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    {
      provide: HashingProvider,
      useClass: BcryptProvider,
    },
    LocalStrategy,
    LoginUserProvider,
    JwtStrategy,
    JwtRefreshStrategy,
    RefreshTokenRepositoryOperations,
    RefreshTokensProvider,
    FindOneRefreshTokenProvider,
    GenerateTokensProvider,
  ],
  exports: [
    AuthService,
    HashingProvider,
    RefreshTokenRepositoryOperations,
    RefreshTokensProvider,
    FindOneRefreshTokenProvider,
    GenerateTokensProvider,
  ],
})
export class AuthModule {}
