import { Trim } from 'class-sanitizer';
import { IsEmail, IsString } from 'class-validator';

export class LoginDto {
  @Trim()
  @IsEmail()
  public readonly email: string;

  @IsString()
  public readonly password: string;
}

export class AuthUserResponseDto {
  public id: string | number;
  public firstName: string;
  public lastName: string;
  public email: string;
  public authToken: string;
}
