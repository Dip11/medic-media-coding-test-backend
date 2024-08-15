import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from '@/database/entities/user.entity';
import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthUserResponseDto } from './auth.dto';
import { classToPlain } from 'class-transformer';
import { JwtService } from '@nestjs/jwt';

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
   * JWT サービスを保持するプロパティ。
   *
   * JWT (JSON Web Token) の生成や検証、デコードを行うために使用します。
   */
  private readonly jwt: JwtService;

  /**
   * `AuthHelperService` のコンストラクタ。
   *
   * @param jwt - JWT サービスを注入します。
   */
  constructor(jwt: JwtService) {
    this.jwt = jwt;
  }

  /**
   * JWT トークンをデコードするメソッド。
   *
   * 指定された JWT トークンをデコードし、その内容を返します。
   *
   * @param token - デコードする JWT トークン。
   * @returns デコードされたトークンの内容。
   */
  public async decode(token: string): Promise<unknown> {
    return this.jwt.decode(token, null);
  }

  /**
   * デコードされた JWT トークンから取得したユーザーIDを使用して、ユーザーを取得するメソッド。
   *
   * データベースからユーザーを検索し、`classToPlain` を使用してレスポンスからパスワードを除外した
   * ユーザー情報を返します。
   *
   * @param decoded - デコードされた JWT トークンの内容。
   * @returns パスワードを除外したユーザー情報。
   */
  public async validateUser(decoded: any): Promise<AuthUserResponseDto | any> {
    const data = await this.repository.findOne({
      where: {
        id: decoded.id,
      },
    });

    /**
     * `classToPlain` を使用することで、レスポンスからパスワードを除外することが重要です。
     */
    return classToPlain(data);
  }

  /**
   * ユーザー情報をもとに JWT トークンを生成するメソッド。
   *
   * ユーザーIDとメールアドレスをペイロードとして含む JWT トークンを生成し、返します。
   *
   * @param user - トークンを生成するユーザー情報。
   * @returns 生成された JWT トークン。
   */
  public generateToken(user: User): string {
    return this.jwt.sign({ id: user.id, email: user.email });
  }

  /**
   * ユーザーのパスワードを検証するメソッド。
   *
   * 指定されたパスワードと、保存されたハッシュ化パスワードを比較し、一致するかどうかを確認します。
   *
   * @param password - 入力された平文のパスワード。
   * @param userPassword - 保存されているハッシュ化されたパスワード。
   * @returns パスワードが有効かどうかの真偽値。
   */
  public isPasswordValid(password: string, userPassword: string): boolean {
    return bcrypt.compareSync(password, userPassword);
  }

  /**
   * ユーザーのパスワードをエンコードするメソッド。
   *
   * bcrypt ハッシュアルゴリズムを使用して、指定されたパスワードを安全にハッシュ化します。
   * ソルトを生成し、そのソルトを使ってパスワードをハッシュ化します。
   *
   * @param password - エンコードする平文のパスワード。
   * @returns ハッシュ化されたパスワード。
   */
  public encodePassword(password: string): string {
    const salt: string = bcrypt.genSaltSync(10);

    return bcrypt.hashSync(password, salt);
  }

  /**
   * JWT トークンを検証するメソッド。
   *
   * 指定された JWT トークンが有効かどうかを検証し、無効な場合は `HttpException` をスローします。
   * トークンが有効で、対応するユーザーが存在する場合にのみ、`true` を返します。
   *
   * @param token - 検証する JWT トークン。
   * @returns トークンが有効かどうかの真偽値。
   * @throws HttpException - トークンが無効な場合にスローされます。
   * @throws UnauthorizedException - ユーザーが存在しない場合にスローされます。
   */
  private async validate(token: string): Promise<boolean | never> {
    const decoded: unknown = this.jwt.verify(token);

    if (!decoded) {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }

    const user: AuthUserResponseDto = await this.validateUser(decoded);

    if (!user) {
      throw new UnauthorizedException();
    }

    return true;
  }
}
