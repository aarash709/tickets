import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class AuthDto {
  @IsEmail()
  @IsNotEmpty()
  email!: string;
  @IsString()
  @IsNotEmpty()
  displayName!: string;
  @IsNotEmpty()
  @IsString()
  @MinLength(4)
  password!: string;
}
