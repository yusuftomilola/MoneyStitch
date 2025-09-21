import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ErrorCatch } from 'utils/error';

@Injectable()
export class GetUsersProvider {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  public async getUsers(): Promise<User[]> {
    try {
      const users = await this.usersRepository.find();

      if (!users) {
        throw new NotFoundException('No users found');
      }

      return users;
    } catch (error) {
      ErrorCatch(error, 'Error getting users');
    }
  }
}
