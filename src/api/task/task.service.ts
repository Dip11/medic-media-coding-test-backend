import { Task } from '@/database/entities/task.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AddTaskInputDTO } from './task.dto';
@Injectable()
export class TaskService {
  @InjectRepository(Task)
  private readonly repository: Repository<Task>;

  public async add(addTaskInputDTO: AddTaskInputDTO): Promise<Task> {
    const { title, detail, dueDate }: AddTaskInputDTO = addTaskInputDTO;

    const task = new Task();
    task.title = title;
    task.detail = detail;
    task.dueDate = dueDate;

    return this.repository.save(task);
  }
}
