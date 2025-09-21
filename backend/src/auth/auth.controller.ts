import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './providers/auth.service';
import { CreateUserDto } from 'src/users/dto/createUser.dto';
import { User } from 'src/users/entities/user.entity';
import { LoginUserDto } from 'src/users/dto/loginUser.dto';
import { GetCurrentUser } from './decorators/getCurrentUser.decorator';
import { LocalAuthGuard } from './guards/local.guard';
import { Response } from 'express';
import { IsPublic } from './decorators/public.decorator';

@Controller('api/v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // CREATE USER
  @IsPublic()
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  public async createUser(@Body() createUserDto: CreateUserDto): Promise<User> {
    return await this.authService.createUser(createUserDto);
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
  ) {
    return await this.authService.loginUser(user, response);
  }
}
