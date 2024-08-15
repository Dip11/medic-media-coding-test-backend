import { Task } from '@/database/entities/task.entity';
import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AddTaskInputDTO, UpdateTaskInputDTO } from './task.dto';
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

  /**
   * 指定されたタスクIDと新しいタスク情報を基に、既存のタスクを更新するメソッド。
   *
   * このメソッドは、データベースから指定されたIDのタスクを検索し、見つかった場合は、
   * タスクのタイトル、詳細、期限日を更新します。更新されたタスクはデータベースに保存され、
   * 保存されたタスクオブジェクトが返されます。タスクが見つからない場合は、適切なエラーがスローされます。
   *
   * @param id - 更新するタスクのID。
   * @param updateTaskInputDTO - タスクの新しい情報を含むDTO。
   * @returns 更新されたタスクオブジェクト (`Task`)。
   * @throws HttpException - 指定されたIDのタスクが見つからない場合にスローされます。
   */
  public async update(
    id: string,
    updateTaskInputDTO: UpdateTaskInputDTO,
  ): Promise<Task> {
    // DTOからタスクの詳細情報を取得します。

    const { title, detail, dueDate }: AddTaskInputDTO = updateTaskInputDTO;

    // IDに基づいて既存のタスクを検索します。
    const task: Task = await this.repository.findOne({
      where: { id: parseInt(id) },
    });

    // タスクが見つからない場合は、エラーメッセージをスローします。

    if (!task) {
      throw new HttpException(`ID${id} のタスクは見つかりませんでした。`, 500);
    }

    // 既存のタスクエンティティのプロパティを更新します。
    task.title = title;
    task.detail = detail;
    task.dueDate = dueDate;

    // タスクをデータベースに保存し、保存されたタスクオブジェクトを返します。
    return this.repository.save(task);
  }

  /**
   * 指定されたタスクIDに基づいて、既存のタスクを削除するメソッド。
   *
   * このメソッドは、データベースから指定されたIDのタスクを検索し、見つかった場合は、
   * そのタスクをデータベースから削除します。削除されたタスクオブジェクトが返されます。
   * タスクが見つからない場合は、適切なエラーがスローされます。
   *
   * @param id - 削除するタスクのID。
   * @returns 削除されたタスクオブジェクト (`Task`)。
   * @throws HttpException - 指定されたIDのタスクが見つからない場合にスローされます。
   */
  public async delete(id: string): Promise<Task> {
    // IDに基づいて既存のタスクを検索します。

    const task: Task = await this.repository.findOne({
      where: { id: parseInt(id) },
    });

    // タスクが見つからない場合は、エラーメッセージをスローします。
    if (!task) {
      throw new HttpException(`ID${id} のタスクは見つかりませんでした。`, 500);
    }

    // タスクをデータベースから削除し、削除されたタスクオブジェクトを返します。
    return this.repository.remove(task);
  }
}
