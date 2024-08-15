import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { ApiOkResponse } from '@nestjs/swagger';
import {
  AddTaskInputDTO,
  GetTasksQueryDTO,
  GetTasksResponseDTO,
  UpdateTaskInputDTO,
} from './task.dto';
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
   * すべてのタスクを取得するエンドポイント。
   *
   * クライアントから送信されたクエリパラメータ (`GetTasksQueryDTO`) と認証済みユーザー情報を基に、
   * 現在のユーザーに関連するすべてのタスクを取得します。取得されたタスクは、
   * `GetTasksResponseDTO` オブジェクトとしてレスポンスとして返されます。
   *
   * @param query - タスクをフィルタリングするためのクエリパラメータ。
   * @param user - リクエストから取得された認証済みのユーザー情報。
   * @returns 取得されたすべてのタスクの情報 (`GetTasksResponseDTO`)。
   */
  @Get('/')
  @ApiOkResponse({
    description: 'すべてのタスクの応答データ',
    type: GetTasksResponseDTO,
  })
  public async getAll(
    @Query() query: GetTasksQueryDTO,
    @Req() { user }: Request,
  ): Promise<GetTasksResponseDTO> {
    // すべてのタスクを取得し、取得されたタスクの情報を返します。
    return this.taskService.getAll(query, <User>user);
  }

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

  /**
   * 既存のタスクを編集するエンドポイント。
   *
   * クライアントから送信されたタスクIDと新しいタスク情報 (`UpdateTaskInputDTO`) を受け取り、
   * 指定されたタスクを更新します。更新されたタスクは、レスポンスとして返されます。
   *
   * @param id - 更新するタスクのID。
   * @param updateTaskInputDTO - 更新するタスクの新しい情報を含む DTO。
   * @returns 更新されたタスクの情報 (`Task`)。
   */
  @Put(':id')
  @ApiOkResponse({
    description: '既存のタスクを編集した後の応答データ',
    type: Task,
  })
  public async update(
    @Param('id') id: string,
    @Body() updateTaskInputDTO: UpdateTaskInputDTO,
  ): Promise<Task> {
    return this.taskService.update(id, updateTaskInputDTO);
  }

  /**
   * 既存のタスクを削除するエンドポイント。
   *
   * クライアントから送信されたタスクIDを受け取り、指定されたタスクを削除します。
   * 削除されたタスクの情報は、レスポンスとして返されます。
   *
   * @param id - 削除するタスクのID。
   * @returns 削除されたタスクの情報 (`Task`)。
   */
  @Delete(':id')
  @ApiOkResponse({
    description: 'タスク削除後の応答データ',
    type: Task,
  })
  public async delete(@Param('id') id: string): Promise<Task> {
    // タスクを削除し、削除されたタスクの情報を返します。
    return this.taskService.delete(id);
  }
}
