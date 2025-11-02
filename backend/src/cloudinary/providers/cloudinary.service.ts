import {
  BadRequestException,
  Injectable,
  ForbiddenException,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { v2 } from 'cloudinary';
import toStream = require('buffer-to-stream');
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { CloudinaryImage } from '../cloudinary.entity';
import { Repository } from 'typeorm';
import { FileTypes } from '../enums/fileTypes.enum';
import { User } from 'src/users/entities/user.entity';
import { UpdateUserProfileResponse } from '../interfaces/responses.interface';

@Injectable()
export class CloudinaryService {
  private readonly logger = new Logger(CloudinaryService.name);

  constructor(
    private readonly configService: ConfigService,

    @InjectRepository(CloudinaryImage)
    private readonly cloudinaryImageRepository: Repository<CloudinaryImage>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {
    // Configure Cloudinary once during service initialization
    v2.config({
      cloud_name: this.configService.get('CLOUDINARY_API_CLOUD_NAME'),
      api_key: this.configService.get('CLOUDINARY_API_KEY'),
      api_secret: this.configService.get('CLOUDINARY_API_SECRET'),
    });
  }

  async uploadFileToCloudinary(
    file: Express.Multer.File,
  ): Promise<{ statusCode: number; data?: CloudinaryImage; message?: string }> {
    // Validate file type
    if (!['image/gif', 'image/jpeg', 'image/png'].includes(file.mimetype)) {
      throw new BadRequestException('Mime type is not supported');
    }

    // Validate file size (1MB limit)
    if (file.size > 1 * 1024 * 1024) {
      throw new BadRequestException('File size exceeds 1MB limit');
    }

    return new Promise((resolve) => {
      const upload = v2.uploader.upload_stream(async (error, result) => {
        if (error) {
          return resolve({ statusCode: 400, message: error.message });
        }

        // save image details to database
        try {
          const uploadedImage = this.cloudinaryImageRepository.create({
            name: file.originalname,
            path: result.secure_url,
            type: FileTypes.IMAGE,
            mime: file.mimetype,
            size: file.size,
          });

          const savedImage =
            await this.cloudinaryImageRepository.save(uploadedImage);

          resolve({ statusCode: 200, data: savedImage });
        } catch (error) {
          resolve({ statusCode: 500, message: 'Error saving to database' });
        }
      });

      toStream(file.buffer).pipe(upload);
    });
  }

  async updateUserProfilePicture(
    userId: string,
    file: Express.Multer.File,
  ): Promise<UpdateUserProfileResponse> {
    // Find the user
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['profilePic'],
    });

    if (!user) {
      this.logger.error(`User ${userId} was not found in the database`);
      throw new NotFoundException('User not found');
    }

    try {
      // Upload new image to Cloudinary
      const uploadResult = await this.uploadFileToCloudinary(file);

      if (uploadResult.statusCode !== 200) {
        return {
          statusCode: uploadResult.statusCode,
          message: uploadResult.message || 'Failed to upload image',
          user,
        };
      }

      // If user has existing profile picture, delete it from Cloudinary
      if (user.profilePic) {
        await this.deleteImageFromCloudinary(user.profilePic.path);
        // Delete old image record from database
        await this.cloudinaryImageRepository.remove(user.profilePic);
      }

      // Set the relationship from BOTH sides
      const newProfilePic = uploadResult.data;
      newProfilePic.user = user; // Set from CloudinaryImage side
      await this.cloudinaryImageRepository.save(newProfilePic); // Save the image with user reference

      user.profilePic = newProfilePic; // Set from User side
      await this.userRepository.save(user);

      return {
        statusCode: 200,
        message: 'Profile picture updated successfully',
        user,
      };
    } catch (error) {
      return {
        statusCode: 500,
        message: 'Error updating profile picture',
        user,
      };
    }
  }

  private async deleteImageFromCloudinary(imagePath: string): Promise<void> {
    try {
      // Extract public_id from the Cloudinary URL
      const publicId = imagePath.split('/').pop()?.split('.')[0];
      if (publicId) {
        await v2.uploader.destroy(publicId);
      }
    } catch (error) {
      console.error('Error deleting image from Cloudinary:', error);
      // Continue execution even if deletion fails
    }
  }
}
