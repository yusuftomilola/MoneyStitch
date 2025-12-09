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
import { PaginationModule } from './common/pagination/pagination.module';
import { AuditLogModule } from './audit-log/audit-log.module';
import { GatewaysModule } from './common/gateways/gateways.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: environmentValidation,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        if (configService.get('NODE_ENV') === 'production') {
          return {
            type: 'postgres',
            database: configService.get('DATABASE_NAME_PRODUCTION'),
            password: configService.get('DATABASE_PASSWORD_PRODUCTION'),
            username: configService.get('DATABASE_USERNAME_PRODUCTION'),
            port: +configService.get('DATABASE_PORT_PRODUCTION'),
            host: configService.get('DATABASE_HOST_PRODUCTION'),
            autoLoadEntities: true,
            synchronize: true,
            ssl: { rejectUnauthorized: false },
          };
        } else {
          return {
            type: 'postgres',
            database: configService.get('DATABASE_NAME_DEVELOPMENT'),
            password: configService.get('DATABASE_PASSWORD_DEVELOPMENT'),
            username: configService.get('DATABASE_USERNAME_DEVELOPMENT'),
            port: +configService.get('DATABASE_PORT_DEVELOPMENT'),
            host: configService.get('DATABASE_HOST_DEVELOPMENT'),
            autoLoadEntities: true,
            synchronize: true,
          };
        }
      },
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
    PaginationModule,
    AuditLogModule,
    GatewaysModule,
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
