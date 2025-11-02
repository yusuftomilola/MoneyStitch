import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserRole } from '../enums/userRoles.enum';
import { Exclude } from 'class-transformer';
import { RefreshToken } from 'src/auth/entities/refreshToken.entity';
import { CloudinaryImage } from 'src/cloudinary/cloudinary.entity';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    nullable: false,
  })
  firstname: string;

  @Column({
    nullable: false,
  })
  lastname: string;

  @Column({
    nullable: true,
  })
  username?: string;

  @Column({
    nullable: true,
  })
  bio?: string;

  @Column({
    nullable: true,
  })
  phone?: string;

  @Column({
    nullable: false,
    unique: true,
  })
  email: string;

  @Column({
    nullable: false,
  })
  @Exclude()
  password: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole;

  @OneToOne(() => CloudinaryImage, (profilePic) => profilePic.user, {
    eager: true,
  })
  profilePic?: CloudinaryImage;

  @Column({
    nullable: true,
  })
  @Exclude()
  passwordResetToken?: string;

  @Column({
    nullable: true,
  })
  @Exclude()
  passwordResetExpiresIn?: Date;

  @Column({
    type: 'boolean',
    default: true,
  })
  isActive: boolean;

  @Column({
    default: false,
  })
  isEmailVerified: boolean;

  @Column({
    nullable: true,
  })
  @Exclude()
  emailVerificationToken?: string;

  @Column({
    nullable: true,
  })
  @Exclude()
  emailVerificationExpiresIn?: Date;

  @OneToMany(() => RefreshToken, (refreshToken) => refreshToken.user)
  @Exclude()
  refreshTokens: RefreshToken[];

  @Column({
    type: 'boolean',
    default: false,
  })
  isDeleted: boolean;

  @Column({
    type: 'boolean',
    default: false,
  })
  isSuspended: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
