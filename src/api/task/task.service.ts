import { Task } from '@/database/entities/task.entity';
import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import {
  AddTaskInputDTO,
  GetTasksQueryDTO,
  GetTasksResponseDTO,
  UpdateTaskInputDTO,
} from './task.dto';
import { User } from '@/database/entities/user.entity';
@Injectable()
export class TaskService {
  /**
   * `TaskService` のコンストラクタ。
   *
   * タスクリポジトリとデータベース接続のための `DataSource` を注入します。
   *
   * @param repository - タスクエンティティに対するデータベース操作を行うリポジトリ。
   * @param dataSource - データベースへの接続を管理するデータソース。
   */
  constructor(
    @InjectRepository(Task) private readonly repository: Repository<Task>,
    private readonly dataSource: DataSource,
  ) {}

  /**
   * すべてのタスクを取得するメソッド。
   *
   * 指定されたクエリパラメータ (`GetTasksQueryDTO`) と認証済みユーザーを基に、
   * ユーザーに関連するすべてのタスクをデータベースから取得します。
   * このメソッドはトランザクションを使用して、データの一貫性を確保します。
   *
   * @param query - タスクをフィルタリングおよびソートするためのクエリパラメータ。
   * @param user - 現在の認証済みユーザー。
   * @returns 取得されたタスクの情報 (`GetTasksResponseDTO`)。
   * @throws HttpException - データベース操作に失敗した場合にスローされます。
   */
  public async getAll(
    query: GetTasksQueryDTO,
    user: User,
  ): Promise<GetTasksResponseDTO> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const { sortBy, sortDir } = query;

      // タスクをクエリビルダーを使用して取得し、ユーザーIDでフィルタリングします。
      const taskQuery = queryRunner.manager
        .getRepository(Task)
        .createQueryBuilder('task')
        .where('task.createdBy = :id', {
          id: user.id,
        });

      // ソート条件が指定されている場合は、それに従ってソートします。
      if (sortBy && sortDir) {
        taskQuery.orderBy(`task.${sortBy}`, sortDir);
      }

      // クエリを実行し、すべてのタスクを取得します。
      const allTasks: Task[] = await taskQuery.getMany();

      // 取得されたタスクデータをレスポンスオブジェクトに設定します。
      const responseData: GetTasksResponseDTO = {
        data: allTasks,
      };

      // トランザクションをコミットして変更を確定します。
      await queryRunner.commitTransaction();
      return responseData;
    } catch (error) {
      // エラーが発生した場合、トランザクションをロールバックします。
      console.log(error);
      await queryRunner.rollbackTransaction();
      throw new HttpException(error.message, 500);
    } finally {
      // 手動で作成したクエリランナーを解放して接続を閉じます。
      await queryRunner.release();
    }
  }

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
