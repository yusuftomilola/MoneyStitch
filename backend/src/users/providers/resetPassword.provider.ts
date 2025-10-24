import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { IsNull, MoreThan, Not, Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ResetPasswordDto } from 'src/auth/dto/resetPassword.dto';
import { HashingProvider } from 'src/auth/providers/hashing.provider';
import { EmailService } from 'src/email/email.service';
import { ResetPasswordResponse } from 'src/auth/interfaces/authResponses.interface';

@Injectable()
export class ResetPasswordProvider {
  private readonly logger = new Logger(ResetPasswordProvider.name);

  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,

    private readonly emailService: EmailService,

    @Inject(forwardRef(() => HashingProvider))
    private readonly hashingProvider: HashingProvider,
  ) {}

  public async resetPassword(
    resetPasswordDto: ResetPasswordDto,
  ): Promise<ResetPasswordResponse> {
    const { token, newPassword } = resetPasswordDto;

    // CLAUDE
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
      this.logger.error('Invalid or expired password reset token provided');
      throw new BadRequestException('Invalid or expired password reset token');
    }
    // STOPS HERE

    // MINE
    // const user = await this.usersRepository.findOne({
    //   where: {
    //     passwordResetToken: token,
    //   },
    // });

    // if (
    //   !user ||
    //   !user?.passwordResetToken ||
    //   !user.passwordResetExpiresIn ||
    //   user.passwordResetExpiresIn < new Date()
    // ) {
    //   this.logger.error('Invalid or expired password reset token provided');
    //   throw new BadRequestException('Invalid or expired password reset token');
    // }
    // STOPS HERE

    user.password = await this.hashingProvider.hash(newPassword);
    user.passwordResetToken = null;
    user.passwordResetExpiresIn = null;

    await this.usersRepository.save(user);
    this.logger.log('Password reset was successful');

    // send reset password confirmation message
    await this.emailService.sendPasswordResetSuccessConfirmationEmail(user);
    this.logger.log(
      'Password reset confirmation email has been sent to: ',
      user.email,
    );

    return {
      status: 'success',
      message: 'Password has been reset successfully',
    };
  }
}
