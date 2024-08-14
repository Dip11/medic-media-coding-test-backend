import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiOkResponse } from '@nestjs/swagger';
import { User } from '@/database/entities/user.entity';
import { RegisterUserInputDTO } from './user.dto';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  /**
   * ユーザーを登録するエンドポイント。
   *
   * このメソッドは、クライアントから送信されたユーザー登録データ (`RegisterUserInputDTO`) を受け取り、
   * ユーザー登録処理を実行します。その後、登録されたユーザー情報 (`User`) をレスポンスとして返します。
   *
   * @returns 登録されたユーザーの情報 (`User`) を含むレスポンス。
   *
   * エンドポイント: POST /register
   *
   * @param registerUserInputDTO - 登録に必要なユーザー情報を含むデータ転送オブジェクト (DTO)。
   */
  @Post('/register')
  @ApiOkResponse({
    description: 'ユーザー登録後のレスポンスデータ',
    type: User,
  })
  public async register(
    @Body() registerUserInputDTO: RegisterUserInputDTO,
  ): Promise<User> {
    return this.userService.register(registerUserInputDTO);
  }
}
