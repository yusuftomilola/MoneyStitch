import {
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  RequestTimeoutException,
} from '@nestjs/common';
import { HashingProvider } from 'src/auth/providers/hashing.provider';
import { GenerateRandomTokenProvider } from './generateRandomToken.provider';
import { User } from '../entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ErrorCatch } from 'src/common/helpers/errorCatch.util';

@Injectable()
export class EmailVerificationTokenProvider {
  private readonly logger = new Logger(EmailVerificationTokenProvider.name);

  constructor(
    @Inject(forwardRef(() => HashingProvider))
    private readonly hashingProvider: HashingProvider,

    private readonly generateRandomTokenProvider: GenerateRandomTokenProvider,

    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  public async getEmailVerificationToken(user: User): Promise<string> {
    // generate the random token
    const plainToken = this.generateRandomTokenProvider.getRandomToken();
    // hash the token
    let hashedToken: string;

    try {
      hashedToken = await this.hashingProvider.hash(plainToken);

      // save to database
      user.emailVerificationToken = hashedToken;
      user.emailVerificationExpiresIn = new Date(Date.now() + 3600000);

      await this.usersRepository.save(user);
      this.logger.log(
        'Email verification token generated successfully and saved to user',
      );
    } catch (error) {
      ErrorCatch('Email verification token generation failed', error);
    }

    return plainToken;
  }
}
