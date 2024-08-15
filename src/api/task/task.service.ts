import { Task } from '@/database/entities/task.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AddTaskInputDTO } from './task.dto';
import { User } from '@/database/entities/user.entity';
@Injectable()
export class TaskService {
  /**
   * タスクリポジトリを注入するプロパティ。
   *
   * TypeORM の `Repository<Task>` を使用して、データベースに対するタスクエンティティの操作を行います。
   */
  @InjectRepository(Task)
  private readonly repository: Repository<Task>;

  /**
   * 新しいタスクを追加するメソッド。
   *
   * 指定されたタスクデータ (`AddTaskInputDTO`) と認証済みのユーザーを基に、新しいタスクを作成します。
   * 作成されたタスクはデータベースに保存され、その保存されたタスクオブジェクトが返されます。
   *
   * @param addTaskInputDTO - 追加するタスクの情報を含む DTO。
   * @param user - タスクを作成する認証済みのユーザー情報。
   * @returns データベースに保存されたタスクオブジェクト (`Task`)。
   */
  public async add(
    addTaskInputDTO: AddTaskInputDTO,
    user: User,
  ): Promise<Task> {
    // DTOからタスクの詳細情報を取得し、認証済みユーザーを取得します。

    const { title, detail, dueDate }: AddTaskInputDTO = addTaskInputDTO;
    const authUser = user;

    // 新しいタスクエンティティを作成し、プロパティを設定します。
    const task = new Task();
    task.title = title;
    task.detail = detail;
    task.dueDate = dueDate;
    task.createdBy = authUser;

    // タスクをデータベースに保存し、保存されたタスクオブジェクトを返します。
    return this.repository.save(task);
  }
}
