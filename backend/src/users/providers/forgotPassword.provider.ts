import { forwardRef, Injectable, Inject, Logger } from '@nestjs/common';
import { HashingProvider } from 'src/auth/providers/hashing.provider';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { GenerateRandomTokenProvider } from './generateRandomToken.provider';

@Injectable()
export class ForgotPasswordResetTokenProvider {
  private readonly logger = new Logger(ForgotPasswordResetTokenProvider.name);

  constructor(
    @Inject(forwardRef(() => HashingProvider))
    private readonly hashingProvider: HashingProvider,

    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,

    private readonly generateRandomToken: GenerateRandomTokenProvider,
  ) {}

  public async setForgotPasswordResetToken(email: string) {
    const user = await this.usersRepository.findOne({
      where: {
        email,
      },
    });

    if (!user) {
      // intentionally do nothing for security (don't reveal if email exists)
      this.logger.log(
        `Forgot password requested for non-existent email: ${email}`,
      );
      return null;
    }

    const plainToken = this.generateRandomToken.getRandomToken();

    // hash token before saving
    const hashedToken = await this.hashingProvider.hash(plainToken);

    if (!hashedToken) {
      this.logger.log(`Error hashing the password reset token`);
      throw new Error('Failed to generate reset token');
    }

    // save the hashed token and the expiration (1 hours) to database
    ((user.passwordResetToken = hashedToken),
      (user.passwordResetExpiresIn = new Date(Date.now() + 3600000)));

    await this.usersRepository.save(user);

    return {
      plainToken,
      user,
    };
  }
}
