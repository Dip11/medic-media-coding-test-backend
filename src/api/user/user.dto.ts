import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class RegisterUserInputDTO {
  @ApiProperty()
  @IsString()
  email: string;

  @ApiProperty()
  @IsString()
  password: string;

  @ApiProperty()
  @IsString()
  firstName: string;

  @ApiProperty()
  @IsString()
  lastName: string;
}
