import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class AddTaskInputDTO {
  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsString()
  detail: string;

  @ApiProperty()
  @IsString()
  dueDate: string;
}

export class UpdateTaskInputDTO {
  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsString()
  detail: string;

  @ApiProperty()
  @IsString()
  dueDate: string;
}
