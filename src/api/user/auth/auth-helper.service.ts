import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from '@/database/entities/user.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthHelperService {
  /**
   * ユーザーリポジトリを注入するプロパティ。
   *
   * TypeORM の `Repository` を使用して、データベースに対するユーザーエンティティの操作を行います。
   */
  @InjectRepository(User)
  private readonly repository: Repository<User>;

  /**
   * ユーザーのパスワードをエンコードするメソッド。
   *
   * このメソッドは bcrypt ハッシュアルゴリズムを使用して、指定されたパスワードを安全にハッシュ化します。
   * まず、bcrypt の `genSaltSync` 関数を使用してソルトを生成し、そのソルトを使って
   * `hashSync` 関数でパスワードをハッシュ化します。生成されたハッシュはセキュリティのため、
   * データベースに保存されます。
   *
   * @param password - エンコードする平文のパスワード。
   * @returns ハッシュ化されたパスワード。
   */
  public encodePassword(password: string): string {
    // パスワードをハッシュ化するためのソルトを生成します（コストファクター: 10）。
    const salt: string = bcrypt.genSaltSync(10);

    // パスワードをソルトを使ってハッシュ化し、その結果を返します。
    return bcrypt.hashSync(password, salt);
  }
}
