// entities/audit-log.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { User } from 'src/users/entities/user.entity';

export enum AuditAction {
  // Auth actions
  USER_LOGIN = 'USER_LOGIN',
  USER_LOGOUT = 'USER_LOGOUT',
  USER_REGISTER = 'USER_REGISTER',
  PASSWORD_RESET_REQUEST = 'PASSWORD_RESET_REQUEST',
  PASSWORD_RESET_COMPLETE = 'PASSWORD_RESET_COMPLETE',
  PASSWORD_CHANGE = 'PASSWORD_CHANGE',
  EMAIL_VERIFICATION_SENT = 'EMAIL_VERIFICATION_SENT',
  EMAIL_VERIFIED = 'EMAIL_VERIFIED',
  TOKEN_REFRESH = 'TOKEN_REFRESH',

  // User actions
  USER_PROFILE_VIEW = 'USER_PROFILE_VIEW',
  USER_PROFILE_UPDATE = 'USER_PROFILE_UPDATE',
  USER_ACCOUNT_DELETE = 'USER_ACCOUNT_DELETE',
  USER_DATA_EXPORT = 'USER_DATA_EXPORT',

  // Admin actions
  ADMIN_USER_VIEW = 'ADMIN_USER_VIEW',
  ADMIN_USER_UPDATE = 'ADMIN_USER_UPDATE',
  ADMIN_USER_DELETE = 'ADMIN_USER_DELETE',
  ADMIN_USER_SUSPEND = 'ADMIN_USER_SUSPEND',
  ADMIN_USER_ACTIVATE = 'ADMIN_USER_ACTIVATE',
  ADMIN_USERS_LIST = 'ADMIN_USERS_LIST',
}

export enum AuditStatus {
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
  UNAUTHORIZED = 'UNAUTHORIZED',
}

@Entity({ name: 'audit_logs' })
@Index(['userId', 'createdAt'])
@Index(['action', 'createdAt'])
@Index(['ipAddress', 'createdAt'])
export class AuditLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: AuditAction,
  })
  action: AuditAction;

  @Column({
    type: 'enum',
    enum: AuditStatus,
    default: AuditStatus.SUCCESS,
  })
  status: AuditStatus;

  @Column({ nullable: true })
  userId?: string;

  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'userId' })
  user?: User;

  @Column({ nullable: true })
  targetUserId?: string;

  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'targetUserId' })
  targetUser?: User;

  @Column({ nullable: true })
  ipAddress?: string;

  @Column({ nullable: true })
  userAgent?: string;

  @Column({ type: 'jsonb', nullable: true })
  metadata?: Record<string, any>;

  @Column({ nullable: true })
  errorMessage?: string;

  @CreateDateColumn()
  createdAt: Date;
}
