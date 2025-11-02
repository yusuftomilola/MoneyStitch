import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { ChangePasswordDto } from 'src/auth/dto/changeUserPassword.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Repository, DataSource } from 'typeorm';
import { HashingProvider } from 'src/auth/providers/hashing.provider';
import { ChangePasswordResponse } from 'src/auth/interfaces/authResponses.interface';
import { RefreshTokenRepositoryOperations } from 'src/auth/providers/RefreshTokenCrud.repository';
import { ErrorCatch } from 'src/common/helpers/errorCatch.util';

@Injectable()
export class ChangePasswordProvider {
  private readonly logger = new Logger(ChangePasswordProvider.name);

  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,

    @Inject(forwardRef(() => HashingProvider))
    private readonly hashingProvider: HashingProvider,

    private readonly refreshTokenRepositoryOperations: RefreshTokenRepositoryOperations,

    private readonly datasource: DataSource,
  ) {}

  public async changePassword(
    userId: string,
    changePasswordDto: ChangePasswordDto,
  ): Promise<ChangePasswordResponse> {
    const { currentPassword, newPassword } = changePasswordDto;

    // check if current password is the same as new password
    if (currentPassword === newPassword) {
      this.logger.warn(`User ${userId} tried to change to the same password`);
      throw new BadRequestException(
        'New password must be different from current password',
      );
    }

    // **FIX: Explicitly select the password field**
    let user = await this.usersRepository
      .createQueryBuilder('user')
      .where('user.id = :id', { id: userId })
      .addSelect('user.password') // This ensures password is loaded even if select: false
      .getOne();

    if (!user) {
      this.logger.error(`User ${userId} not found during password change`);
      throw new InternalServerErrorException(
        'Unable to process request. Please log in again.',
      );
    }

    // check if the user's current password matches the password from the database
    const isPasswordValid = await this.hashingProvider.compare(
      currentPassword,
      user.password,
    );

    if (!isPasswordValid) {
      this.logger.warn(`Invalid current password for user ${userId}`);
      throw new UnauthorizedException('Current password is incorrect');
    }

    // if the passwords match, go ahead to hash the new password and save it
    const hashedPassword = await this.hashingProvider.hash(newPassword);

    // use transaction to ensure atomicity
    const queryRunner = this.datasource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      //update the password
      user.password = hashedPassword;
      await queryRunner.manager.save(user);

      // revoke all refresh tokens associated with the user after successful password change
      await this.refreshTokenRepositoryOperations.revokeAllRefreshTokens(
        userId,
      );

      await queryRunner.commitTransaction();

      this.logger.log(`Password changed successfully for user ${userId}`);

      return {
        status: 'success',
        message: 'Password changed successfully. Please log in again.',
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error(
        `Failed to change password for user ${userId}: ${error.message}`,
      );
      ErrorCatch(error, 'Failed to change password. Please try again.');
    } finally {
      await queryRunner.release();
    }
  }
}
