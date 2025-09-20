import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './providers/auth.service';
import { CreateUserDto } from 'src/users/dto/createUser.dto';
import { User } from 'src/users/entities/user.entity';

@Controller('api/v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // CREATE USER
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  public async createUser(@Body() createUserDto: CreateUserDto) {
    console.log(createUserDto);
  }
  //   public async createUser(@Body() createUserDto: CreateUserDto): Promise<User> {
  //     return await this.authService.createUser(createUserDto);
  //   }
}
