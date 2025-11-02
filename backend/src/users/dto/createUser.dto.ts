import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  @MaxLength(30)
  firstname: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  @MaxLength(30)
  lastname: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(20)
  username?: string;

  @IsString()
  @MaxLength(500)
  @IsOptional()
  bio?: string;

  @IsString()
  @MaxLength(11)
  @IsOptional()
  phone?: string;

  @IsNotEmpty()
  @IsEmail()
  @MaxLength(50)
  email: string;

  @IsString()
  @MinLength(8)
  @MaxLength(80)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&\-_.]).+$/, {
    message:
      'Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character (@$!%*?&-_.).',
  })
  password: string;
}
