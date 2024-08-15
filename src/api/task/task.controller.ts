import { Body, Controller, Post } from '@nestjs/common';
import { TaskService } from './task.service';
import { ApiOkResponse } from '@nestjs/swagger';
import { AddTaskInputDTO } from './task.dto';
import { Task } from '@/database/entities/task.entity';

@Controller('tasks')
export class TaskController {
  constructor(private taskService: TaskService) {}

  @Post('/')
  @ApiOkResponse({
    description: '新しいタスク追加後の応答データ',
    type: Task,
  })
  public async add(@Body() addTaskInputDTO: AddTaskInputDTO): Promise<Task> {
    return this.taskService.add(addTaskInputDTO);
  }
}
