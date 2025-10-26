import {
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UploadedFile,
  UseInterceptors,
  Patch,
  Param,
  Request,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from './providers/cloudinary.service';
import { Express } from 'express';
import {
  ApiHeaders,
  ApiOperation,
  ApiTags,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { IsPublic } from 'src/auth/decorators/public.decorator';
import { GetCurrentUser } from 'src/auth/decorators/getCurrentUser.decorator';
import { User } from 'src/users/entities/user.entity';

@Controller('api/v1/cloudinary')
@ApiTags('Cloudinary')
export class CloudinaryController {
  constructor(private readonly cloudinaryService: CloudinaryService) {}

  @Post('online-file-upload')
  @IsPublic()
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    return await this.cloudinaryService.uploadFileToCloudinary(file);
  }

  // ENDPOINT TO USE FOR USER TO UPLOAD THEIR PROFILE IMAGE
  @Patch('profile-picture')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(FileInterceptor('file'))
  async updateProfilePicture(
    @GetCurrentUser() user: User,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return await this.cloudinaryService.updateUserProfilePicture(user.id, file);
  }
}
