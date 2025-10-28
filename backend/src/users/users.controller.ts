import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './providers/users.service';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRole } from './enums/userRoles.enum';
import { GetCurrentUser } from 'src/auth/decorators/getCurrentUser.decorator';
import { User } from './entities/user.entity';
import { UpdateUserDto } from './dto/updateUser.dto';
import { DataExportResponse, UpdateUserResponse } from './interfaces/responses';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';

@Controller('api/v1/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // GET USER PROFILE - USER
  @Get('me')
  @HttpCode(HttpStatus.OK)
  public async getUserProfile(@GetCurrentUser() user: User): Promise<User> {
    console.log('Current user:', user);
    console.log('User ID:', user.id);
    return await this.usersService.userProfile(user);
  }

  // UPDATE USER OWN PROFILE - USER
  @Patch('me/update')
  public async updateUserProfile(
    @GetCurrentUser() user: User,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UpdateUserResponse> {
    return await this.usersService.updateUserProfile(user.id, updateUserDto);
  }

  // DELETE USER OWN ACCOUNT - USER
  @Delete('me/delete')
  public async deleteUserAccount(@GetCurrentUser() user: User) {
    return await this.usersService.deleteSingleUser(user.id);
  }

  // GET ALL USERS - ADMIN ONLY
  @Get()
  @Roles(UserRole.ADMIN)
  public async getUsers(): Promise<User[]> {
    return await this.usersService.getUsers();
  }

  // GET SINGLE USER - ADMIN ONLY
  @Get(':id')
  @Roles(UserRole.ADMIN)
  public async getSingleUser(@Param('id') userId: string): Promise<User> {
    console.log(userId);
    return await this.usersService.getSingleUser(userId);
  }

  // DELETE SINGLE USER - ADMIN ONLY
  @Delete(':id')
  @Roles(UserRole.ADMIN)
  public async deleteSingleUser(@Param('id') userId: string) {
    return await this.usersService.deleteSingleUserAdmin(userId);
  }

  // USER DATA EXPORT
  @UseGuards(ThrottlerGuard)
  @Throttle({
    fiveMinutes: {
      limit: 1,
      ttl: 300000,
    },
  })
  @Post('export-data')
  public async exportUserData(
    @GetCurrentUser() user: User,
  ): Promise<DataExportResponse> {
    return await this.usersService.exportUserData(user.id);
  }
}
