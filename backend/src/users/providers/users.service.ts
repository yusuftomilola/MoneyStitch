import { Injectable } from '@nestjs/common';
import { CreateUserProvider } from './createUser.provider';
import { CreateUserDto } from '../dto/createUser.dto';
import { User } from '../entities/user.entity';
import { FindOneUserByIdProvider } from './findOneUserById.provider';
import { FindOneUserByEmailProvider } from './findOneUserByEmail.provider';
import { ValidateUserProvider } from './validateUser.provider';
import { GetUsersProvider } from './getusers.provider';
import { Response } from 'express';
import { AuthResponse } from 'src/auth/interfaces/authResponse.interface';
import { ForgotPasswordDto } from 'src/auth/dto/forgotPassword.dto';
import { ForgotPasswordResetTokenProvider } from './forgotPassword.provider';
import { ResetPasswordProvider } from './resetPassword.provider';
import {
  ChangePasswordResponse,
  ResendVerifyEmailResponse,
  ResetPasswordResponse,
  VerifyEmailResponse,
} from 'src/auth/interfaces/authResponses.interface';
import { ResetPasswordDto } from 'src/auth/dto/resetPassword.dto';
import { VerifyEmailDto } from 'src/auth/dto/verifyEmail.dto';
import { VerifyEmailProvider } from './verifyEmail.provider';
import { ResendEmailVerificationProvider } from './resendVerifyEmail.provider';
import { ChangePasswordDto } from 'src/auth/dto/changeUserPassword.dto';
import { ChangePasswordProvider } from './changeUserPassword.provider';

@Injectable()
export class UsersService {
  constructor(
    private readonly createUserProvider: CreateUserProvider,
    private readonly findOneUserByIdProvider: FindOneUserByIdProvider,
    private readonly findOneUserByEmailProvider: FindOneUserByEmailProvider,
    private readonly validateUserProvider: ValidateUserProvider,
    private readonly getusersProvider: GetUsersProvider,
    private readonly forgotPasswordResetProvider: ForgotPasswordResetTokenProvider,
    private readonly resetPasswordProvider: ResetPasswordProvider,
    private readonly verifyEmailProvider: VerifyEmailProvider,
    private readonly resendVerifyEmailProvider: ResendEmailVerificationProvider,
    private readonly changePasswordProvider: ChangePasswordProvider,
  ) {}

  // FIND USER BY ID
  public async findUserById(id: string): Promise<User> {
    return await this.findOneUserByIdProvider.getUser(id);
  }

  // FIND USER BY EMAIL
  public async findUserByEmail(email: string): Promise<User> {
    return await this.findOneUserByEmailProvider.getUser(email);
  }

  // CREATE USER
  public async createUser(
    createUserDto: CreateUserDto,
    response: Response,
  ): Promise<AuthResponse> {
    return await this.createUserProvider.createUser(createUserDto, response);
  }

  // VALIDATE USER
  public async validateUser(
    email: string,
    password: string,
  ): Promise<Partial<User>> {
    return await this.validateUserProvider.validateUser(email, password);
  }

  // GET ALL USERS
  public async getUsers(): Promise<User[]> {
    return await this.getusersProvider.getUsers();
  }

  // FORGOT PASSWORD
  public async forgotPasswordResetToken(forgotPasswordDto: ForgotPasswordDto) {
    return await this.forgotPasswordResetProvider.setForgotPasswordResetToken(
      forgotPasswordDto.email,
    );
  }

  // RESET PASSWORD
  public async resetPassword(
    resetPasswordDto: ResetPasswordDto,
  ): Promise<ResetPasswordResponse> {
    return await this.resetPasswordProvider.resetPassword(resetPasswordDto);
  }

  // VERIFY EMAIL
  public async verifyEmail(
    verifyEmailDto: VerifyEmailDto,
  ): Promise<VerifyEmailResponse> {
    return await this.verifyEmailProvider.verifyEmail(verifyEmailDto);
  }

  // RESEND VERIFY USER EMAIL
  public async resendVerifyEmail(
    user: User,
  ): Promise<ResendVerifyEmailResponse> {
    return await this.resendVerifyEmailProvider.resendEmailVerification(user);
  }

  // CHANGE PASSWORD
  public async changePassword(
    userId: string,
    changePasswordDto: ChangePasswordDto,
  ): Promise<ChangePasswordResponse> {
    return await this.changePasswordProvider.changePassword(
      userId,
      changePasswordDto,
    );
  }
}
