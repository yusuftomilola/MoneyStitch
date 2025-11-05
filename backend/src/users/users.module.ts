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
import { EmailModule } from 'src/email/email.module';
import { ResetPasswordProvider } from './providers/resetPassword.provider';
import { EmailVerificationTokenProvider } from './providers/emailVerificationToken.provider';
import { VerifyEmailProvider } from './providers/verifyEmail.provider';
import { ResendEmailVerificationProvider } from './providers/resendVerifyEmail.provider';
import { ChangePasswordProvider } from './providers/changeUserPassword.provider';
import { GetUserProfileProvider } from './providers/getUserProfile.provider';
import { UpdateUserProvider } from './providers/updateUser.provider';
import { DeleteUserProvider } from './providers/deleteUser.provider';
import { DataExportService } from './providers/data-export.service';
import { SuspendUserProvider } from './providers/suspendUser.provider';
import { ActivateUserProvider } from './providers/activeUser.provider';

@Module({
  imports: [
    forwardRef(() => AuthModule),
    TypeOrmModule.forFeature([User]),
    EmailModule,
  ],
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
    ResetPasswordProvider,
    EmailVerificationTokenProvider,
    VerifyEmailProvider,
    ResendEmailVerificationProvider,
    ChangePasswordProvider,
    GetUserProfileProvider,
    UpdateUserProvider,
    DeleteUserProvider,
    DataExportService,
    SuspendUserProvider,
    ActivateUserProvider,
  ],
  exports: [UsersService],
})
export class UsersModule {}
