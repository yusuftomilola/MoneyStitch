import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { VerifyEmailDto } from 'src/auth/dto/verifyEmail.dto';
import { User } from '../entities/user.entity';
import { HashingProvider } from 'src/auth/providers/hashing.provider';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, MoreThan, Not, Repository } from 'typeorm';
import { ErrorCatch } from 'src/common/helpers/errorCatch.util';

@Injectable()
export class VerifyEmailProvider {
  private readonly logger = new Logger(VerifyEmailProvider.name);

  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,

    @Inject(forwardRef(() => HashingProvider))
    private readonly hashingProvider: HashingProvider,
  ) {}

  public async verifyEmail(verifyEmailDto: VerifyEmailDto) {
    const { token } = verifyEmailDto;

    // CLAUDE
    const usersWithEmailVerifyTokens = await this.usersRepository.find({
      where: {
        emailVerificationToken: Not(IsNull()),
        emailVerificationExpiresIn: MoreThan(new Date()),
      },
    });

    let user: User | null = null;

    for (const dbUser of usersWithEmailVerifyTokens) {
      const isMatch = await this.hashingProvider.compare(
        token,
        dbUser.emailVerificationToken,
      );

      if (isMatch) {
        user = dbUser;
        break;
      }
    }

    if (
      !user ||
      !user.emailVerificationToken ||
      !user.emailVerificationExpiresIn ||
      user.emailVerificationExpiresIn < new Date()
    ) {
      this.logger.error('Invalid or expired email verification token');
      throw new BadRequestException(
        'Invalid or expired email verification token',
      );
    }
    // STOPS HERE

    // MINE
    // find the user
    // const user = await this.usersRepository.findOne({
    //   where: {
    //     emailVerificationToken: token,
    //   },
    // });

    // if (!user) {
    //   throw new BadRequestException('Invalid or expired reset token');
    // }

    // check if the token exists and if it has not expired
    // if (
    //   !user.emailVerificationToken ||
    //   !user.emailVerificationExpiresIn ||
    //   user.emailVerificationExpiresIn < new Date()
    // ) {
    //   throw new BadRequestException(
    //     'Email verification token invalid or expired',
    //   );
    // }
    // STOPS HERE

    try {
      user.isEmailVerified = true;
      user.emailVerificationExpiresIn = null;
      user.emailVerificationToken = null;

      await this.usersRepository.save(user);
      this.logger.log(`Email ${user.email} Verified successfully`);
    } catch (error) {
      ErrorCatch('Email verification failed', error);
    }

    return {
      status: 'success',
      message: 'Email verified successfully',
    };
  }
}
