import { Task } from '@/database/entities/task.entity';
import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class GetTasksQueryDTO {
  @ApiProperty()
  @IsString()
  sortBy: string;

  @ApiProperty()
  sortDir: 'ASC' | 'DESC';
}

export class GetTasksResponseDTO {
  @ApiProperty()
  data: Task[];
}

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
