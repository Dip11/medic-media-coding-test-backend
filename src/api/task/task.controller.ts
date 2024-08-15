import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { TaskService } from './task.service';
import { ApiOkResponse } from '@nestjs/swagger';
import { AddTaskInputDTO } from './task.dto';
import { Task } from '@/database/entities/task.entity';
import { JwtAuthGuard } from '../user/auth/auth.guard';
import { Request } from 'express';
import { User } from '@/database/entities/user.entity';

@UseGuards(JwtAuthGuard)
@Controller('tasks')
export class TaskController {
  /**
   * `TaskController` のコンストラクタ。
   *
   * タスク関連の操作を行うためのサービス (`TaskService`) を注入します。
   *
   * @param taskService - タスク操作を担当するサービス。
   */
  constructor(private taskService: TaskService) {}

  /**
   * 新しいタスクを追加するエンドポイント。
   *
   * クライアントから送信されたタスク情報 (`AddTaskInputDTO`) を受け取り、
   * 認証済みのユーザーに関連付けて新しいタスクを作成します。
   * 作成されたタスクは、レスポンスとして返されます。
   *
   * @param addTaskInputDTO - 追加するタスクの情報を含む DTO。
   * @param user - リクエストから取得された認証済みのユーザー情報。
   * @returns 作成されたタスクの情報 (`Task`)。
   */
  @Post('/')
  @ApiOkResponse({
    description: '新しいタスク追加後の応答データ',
    type: Task,
  })
  public async add(
    @Body() addTaskInputDTO: AddTaskInputDTO,
    @Req() { user }: Request,
  ): Promise<Task> {
    // タスクを追加し、作成されたタスクを返します。
    return this.taskService.add(addTaskInputDTO, <User>user);
  }
}
