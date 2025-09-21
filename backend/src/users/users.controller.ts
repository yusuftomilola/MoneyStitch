import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { UsersService } from './providers/users.service';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRole } from './enums/userRoles.enum';

@Controller('api/v1/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // GET ALL USERS - ADMIN ONLY
  @Get()
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.OK)
  public async getUsers() {
    return await this.usersService.getUsers();
  }
}
