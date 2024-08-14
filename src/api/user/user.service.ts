import { Injectable, HttpException, HttpStatus, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { instanceToPlain } from 'class-transformer';
import { User } from '@/database/entities/user.entity';
import { AuthHelperService } from './auth/auth-helper.service';
import { RegisterUserInputDTO } from './user.dto';

@Injectable()
export class UserService {
  /**
   * ユーザーリポジトリを注入するプロパティ。
   *
   * TypeORM の `Repository` を使用して、データベースに対するユーザーエンティティの操作を行います。
   */
  @InjectRepository(User)
  private readonly repository: Repository<User>;

  /**
   * 認証ヘルパーサービスを注入するプロパティ。
   *
   * パスワードのエンコードなど、認証関連の操作を行うために使用します。
   */
  @Inject(AuthHelperService)
  private readonly helper: AuthHelperService;

  /**
   * 新しいユーザーを登録するメソッド。
   *
   * このメソッドは、ユーザー登録のためのデータ転送オブジェクト (`RegisterUserInputDTO`) を受け取り、
   * ユーザーをデータベースに保存します。もし、既に同じメールアドレスのユーザーが存在する場合は、
   * `HttpException` を投げて処理を中断します。
   *
   * @param registerUserInputDTO - 登録するユーザーの情報を含む DTO。
   * @returns 登録されたユーザー情報を含む `User` オブジェクト。
   * @throws HttpException - 既にユーザーが存在する場合に発生します。
   */
  public async register(
    registerUserInputDTO: RegisterUserInputDTO,
  ): Promise<User> {
    const { firstName, lastName, email, password }: RegisterUserInputDTO =
      registerUserInputDTO;

    // メールアドレスで既存のユーザーを検索します。
    let user: User = await this.repository.findOne({ where: { email } });

    // 既にユーザーが存在する場合は、HTTP 409エラーを投げます。
    if (user) {
      throw new HttpException(
        'ユーザーは既に存在します。',
        HttpStatus.CONFLICT,
      );
    }

    // 新しいユーザーエンティティを作成し、プロパティを設定します。
    user = new User();
    user.firstName = firstName;
    user.lastName = lastName;
    user.email = email;
    user.password = this.helper.encodePassword(password);

    // ユーザーをデータベースに保存し、保存されたユーザー情報を返します。
    return instanceToPlain(this.repository.save(user)) as User;
  }
}
