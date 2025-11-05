import { User } from '../entities/user.entity';

export interface UpdateUserResponse {
  status: string;
  message: string;
  user: Partial<User>;
}

export interface DeleteUserResponse {
  status: string;
  message: string;
}

export interface DataExportResponse {
  status: string;
  message: string;
}

export interface SuspendUserResponse {
  status: string;
  message: string;
}

export interface ActivateUserResponse {
  status: string;
  message: string;
}
