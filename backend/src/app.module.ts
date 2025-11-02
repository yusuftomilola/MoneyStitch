import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/guards/jwt.guard';
import { RolesGuard } from './auth/guards/roles.guard';
import { EmailModule } from './email/email.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { ThrottlerModule } from '@nestjs/throttler';
import environmentValidation from './environment.validation';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: environmentValidation,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        database: configService.get('DATABASE_NAME'),
        password: configService.get('DATABASE_PASSWORD'),
        username: configService.get('DATABASE_USERNAME'),
        port: +configService.get('DATABASE_PORT'),
        host: configService.get('DATABASE_HOST'),
        autoLoadEntities: true,
        synchronize: true,
        ssl:
          configService.get('NODE_ENV') === 'production'
            ? { rejectUnauthorized: false }
            : false,
      }),
    }),
    AuthModule,
    UsersModule,
    EmailModule,
    CloudinaryModule,
    ThrottlerModule.forRoot([
      {
        name: 'fiveMinutes',
        ttl: 300000,
        limit: 1,
      },
    ]),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
