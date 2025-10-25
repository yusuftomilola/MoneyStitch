import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { IsNull, MoreThan, Not, Repository, DataSource } from 'typeorm';
import { User } from '../entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ResetPasswordDto } from 'src/auth/dto/resetPassword.dto';
import { HashingProvider } from 'src/auth/providers/hashing.provider';
import { EmailService } from 'src/email/email.service';
import { ResetPasswordResponse } from 'src/auth/interfaces/authResponses.interface';
import { RefreshTokenRepositoryOperations } from 'src/auth/providers/RefreshTokenCrud.repository';
import { ErrorCatch } from 'src/common/helpers/errorCatch.util';

@Injectable()
export class ResetPasswordProvider {
  private readonly logger = new Logger(ResetPasswordProvider.name);

  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,

    private readonly emailService: EmailService,

    @Inject(forwardRef(() => HashingProvider))
    private readonly hashingProvider: HashingProvider,

    private readonly refreshTokenRepositoryOperations: RefreshTokenRepositoryOperations,

    private readonly datasource: DataSource,
  ) {}

  public async resetPassword(
    resetPasswordDto: ResetPasswordDto,
  ): Promise<ResetPasswordResponse> {
    const { token, newPassword } = resetPasswordDto;

    const usersWithResetTokens = await this.usersRepository.find({
      where: {
        passwordResetToken: Not(IsNull()),
        passwordResetExpiresIn: MoreThan(new Date()),
      },
    });

    let user: User | null = null;

    for (const dbUser of usersWithResetTokens) {
      const isMatch = await this.hashingProvider.compare(
        token,
        dbUser.passwordResetToken,
      );

      if (isMatch) {
        user = dbUser;
        break;
      }
    }

    if (!user) {
      this.logger.warn('Invalid or expired password reset token attempt');
      throw new BadRequestException('Invalid or expired password reset token');
    }

    // hash new password
    const hashedPassword = await this.hashingProvider.hash(newPassword);

    // use transaction for atomicity
    const queryRunner = this.datasource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      user.password = hashedPassword;
      user.passwordResetToken = null;
      user.passwordResetExpiresIn = null;

      await queryRunner.manager.save(user);

      // revoke all refresh tokens
      await this.refreshTokenRepositoryOperations.revokeAllRefreshTokens(
        user.id,
      );

      await queryRunner.commitTransaction();

      this.logger.log(`Password reset successful for user ${user.id}`);

      // Send confirmation email AFTER transaction succeeds
      // If this fails, password is already reset and tokens revoked (acceptable trade-off)
      try {
        await this.emailService.sendPasswordResetSuccessConfirmationEmail(user);
        this.logger.log(`Reset confirmation email sent to ${user.email}`);
      } catch (emailError) {
        // Log but don't fail the request because password has already been reset
        this.logger.error(
          `Failed to send reset confirmation email to ${user.email}: ${emailError.message}`,
        );
      }

      return {
        status: 'success',
        message: 'Password has been reset successfully',
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error(`Password reset failed: ${error.message}`);
      ErrorCatch(error, 'Failed to reset password. Please try again.');
    } finally {
      await queryRunner.release();
    }
  }
}
