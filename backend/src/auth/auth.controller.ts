import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './providers/auth.service';
import { CreateUserDto } from 'src/users/dto/createUser.dto';
import { User } from 'src/users/entities/user.entity';
import { LoginUserDto } from 'src/users/dto/loginUser.dto';
import { GetCurrentUser } from './decorators/getCurrentUser.decorator';
import { LocalAuthGuard } from './guards/local.guard';
import { Request, Response } from 'express';
import { IsPublic } from './decorators/public.decorator';
import { AuthResponse } from './interfaces/authResponse.interface';
import { RefreshTokenGuard } from './guards/refreshToken.guard';
import { LogoutResponse } from './interfaces/logout.interface';
import { CookieHelper } from 'src/common/helpers/cookie.helper';
import { ConfigService } from '@nestjs/config';
import { ForgotPasswordDto } from './dto/forgotPassword.dto';
import {
  ChangePasswordResponse,
  ForgotPasswordResponse,
  ResendVerifyEmailResponse,
  ResetPasswordResponse,
  VerifyEmailResponse,
} from './interfaces/authResponses.interface';
import { ResetPasswordDto } from './dto/resetPassword.dto';
import { VerifyEmailDto } from './dto/verifyEmail.dto';
import { ChangePasswordDto } from './dto/changeUserPassword.dto';

@Controller('api/v1/auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  // CREATE USER
  @IsPublic()
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  public async createUser(
    @Body() createUserDto: CreateUserDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<AuthResponse> {
    return await this.authService.createUser(createUserDto, response);
  }

  // LOGIN USER
  @IsPublic()
  @Post('login')
  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  public async loginUser(
    @Body() loginUserDto: LoginUserDto,
    @GetCurrentUser() user: User,
    @Res({ passthrough: true }) response: Response,
  ): Promise<AuthResponse> {
    console.log('=== LOGIN DEBUG ===');

    const result = await this.authService.loginUser(user, response);

    console.log('Response headers:', response.getHeaders());
    console.log('Cookies being set:', response.getHeader('set-cookie'));

    return result;
  }

  // REFRESH-TOKEN
  @IsPublic()
  @Post('refresh-token')
  @UseGuards(RefreshTokenGuard)
  @HttpCode(HttpStatus.OK)
  public async refreshToken(
    @Req() request: Request,
    @GetCurrentUser() user: User,
  ): Promise<AuthResponse> {
    const refreshToken = request.cookies['authRefreshToken'];

    return await this.authService.refreshToken(refreshToken, user.id);
  }

  // LOG OUT
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  public async logout(
    @GetCurrentUser() user: User,
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    console.log('=== LOGOUT DEBUG START ===');
    console.log('User ID:', user.id);
    console.log('All cookies:', request.cookies);

    // Read refresh token from httpOnly cookie
    const refreshToken = request.cookies['authRefreshToken'];
    console.log(
      'Refresh token from cookie:',
      refreshToken ? 'EXISTS' : 'NOT FOUND',
    );

    // Get environment-aware cookie options for clearing
    const clearOptions = CookieHelper.getClearCookieOptions(this.configService);

    if (!refreshToken) {
      console.log('No refresh token found in cookie, clearing anyway');
      response.clearCookie('authRefreshToken', clearOptions);
      return {
        status: true,
        message: 'Logged out successfully (no token found)',
      };
    }

    try {
      console.log('Attempting to revoke refresh token in database...');

      // Revoke the refresh token in database
      const result = await this.authService.logout(user.id, refreshToken);

      console.log('Token revocation result:', result);

      // Clear the refresh token cookie
      response.clearCookie('authRefreshToken', clearOptions);

      console.log('=== LOGOUT DEBUG END (SUCCESS) ===');
      return result;
    } catch (error) {
      console.error('=== LOGOUT ERROR ===');
      console.error('Error during logout:', error);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);

      // Still clear the cookie even if revocation fails
      response.clearCookie('authRefreshToken', clearOptions);

      // Return success to allow frontend logout
      return {
        status: true,
        message: 'Logged out successfully (token revocation failed)',
      };
    }
  }

  // FORGOT PASSWORD
  @IsPublic()
  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  public async forgotPassword(
    @Body() forgotPasswordDto: ForgotPasswordDto,
  ): Promise<ForgotPasswordResponse> {
    return await this.authService.forgotPassword(forgotPasswordDto);
  }

  // RESET PASSWORD
  @IsPublic()
  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  public async resetpassword(
    @Body() resetPasswordDto: ResetPasswordDto,
  ): Promise<ResetPasswordResponse> {
    return await this.authService.resetPassword(resetPasswordDto);
  }

  // VERIFY EMAIL
  @IsPublic()
  @Post('verify-email')
  @HttpCode(HttpStatus.OK)
  public async verifyEmail(
    @Body() verifyEmailDto: VerifyEmailDto,
  ): Promise<VerifyEmailResponse> {
    return await this.authService.verifyEmail(verifyEmailDto);
  }

  // RESEND VERIFICATION EMAIL
  @Post('resend-verify-email')
  @HttpCode(HttpStatus.OK)
  public async resendVerifyEmail(
    @GetCurrentUser() user: User,
  ): Promise<ResendVerifyEmailResponse> {
    return await this.authService.ResendVerifyEmail(user);
  }

  // CHANGE PASSWORD
  @Post('change-password')
  @HttpCode(HttpStatus.OK)
  public async changePassword(
    @GetCurrentUser() user: User,
    @Body() changePasswordDto: ChangePasswordDto,
  ): Promise<ChangePasswordResponse> {
    return await this.authService.changePassword(user.id, changePasswordDto);
  }
}
