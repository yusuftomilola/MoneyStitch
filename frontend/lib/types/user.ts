export enum UserRole {
  USER = "user",
  ADMIN = "admin",
}

export interface User {
  id: string;
  firstname: string;
  lastname: string;
  username?: string | null;
  isEmailVerified: boolean;
  email: string;
  role: "user" | "admin";
  isActive: boolean;
  isSuspended: boolean;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export interface RegisterUser {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
}

export interface LoginUser {
  email: string;
  password: string;
}

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
}

export interface LogoutResponse {
  status: boolean;
  message: string;
}

export interface ForgotPasswordCredentials {
  email: string;
}

export interface ForgotPasswordResponse {
  status: string;
  message: string;
}

export interface ResetPasswordCredentials {
  token: string;
  newPassword: string;
}

export interface ResetPasswordResponse {
  status: string;
  message: string;
}

export interface VerifyEmailCredentials {
  token: string;
}

export interface VerifyEmailResponse {
  status: string;
  message: string;
}

export interface ChangePasswordCredentials {
  currentPassword: string;
  newPassword: string;
}

export interface ChangePasswordResponse {
  status: string;
  message: string;
}

export interface DeleteUserResponse {
  status: string;
  message: string;
}

export interface ResendVerifyEmailResponse {
  status: string;
  message: string;
}
