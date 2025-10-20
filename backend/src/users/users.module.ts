import { forwardRef, Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './providers/users.service';
import { AuthModule } from 'src/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { CreateUserProvider } from './providers/createUser.provider';
import { FindOneUserByEmailProvider } from './providers/findOneUserByEmail.provider';
import { FindOneUserByIdProvider } from './providers/findOneUserById.provider';
import { ValidateUserProvider } from './providers/validateUser.provider';
import { GetUsersProvider } from './providers/getusers.provider';
import { ForgotPasswordResetTokenProvider } from './providers/forgotPassword.provider';
import { GenerateRandomTokenProvider } from './providers/generateRandomToken.provider';

@Module({
  imports: [forwardRef(() => AuthModule), TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [
    UsersService,
    CreateUserProvider,
    FindOneUserByEmailProvider,
    FindOneUserByIdProvider,
    ValidateUserProvider,
    GetUsersProvider,
    ForgotPasswordResetTokenProvider,
    GenerateRandomTokenProvider,
  ],
  exports: [UsersService],
})
export class UsersModule {}
