export enum UserRole {
  USER = "user",
  ADMIN = "admin",
}

export interface User {
  id: string;
  firstname: string;
  lastname: string;
  username?: string;
  email: string;
  role: "user" | "admin";
  isActive: boolean;
  isSuspended: boolean;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
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
