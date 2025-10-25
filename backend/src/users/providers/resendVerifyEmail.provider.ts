import { Injectable, Logger } from '@nestjs/common';
import { User } from '../entities/user.entity';
import { EmailService } from 'src/email/email.service';
import { EmailVerificationTokenProvider } from './emailVerificationToken.provider';
import { ResendVerifyEmailResponse } from 'src/auth/interfaces/authResponses.interface';

@Injectable()
export class ResendEmailVerificationProvider {
  private readonly logger = new Logger(ResendEmailVerificationProvider.name);

  constructor(
    private readonly emailService: EmailService,

    private readonly emailVerificationToken: EmailVerificationTokenProvider,
  ) {}

  public async resendEmailVerification(
    user: User,
  ): Promise<ResendVerifyEmailResponse> {
    // check if the email has already been verified
    if (user.isEmailVerified) {
      this.logger.log('User email has already been verified');
      return {
        status: 'success',
        message: 'Email has already been verified',
      };
    }

    // generate the token
    const verificationToken =
      await this.emailVerificationToken.getEmailVerificationToken(user);

    // send the verification email
    await this.emailService.sendVerificationEmail(user, verificationToken);

    this.logger.log('Verification email has been resent to user');
    return {
      status: 'success',
      message: 'Verification email has been resent. Kindly check your email.',
    };
  }
}
