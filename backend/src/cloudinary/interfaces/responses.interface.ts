import { User } from 'src/users/entities/user.entity';

export interface UpdateUserProfileResponse {
  statusCode: number;
  message: string;
  user: User;
}
