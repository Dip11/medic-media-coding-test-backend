import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsString } from 'class-validator';

export class RegisterUserInputDTO {
  @ApiProperty()
  @IsString()
  tShippingScheduleId?: number;
}
