import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LoginDto, AuthUserResponseDto } from './auth.dto';
import { classToPlain } from 'class-transformer';
import { User } from '@/database/entities/user.entity';
import { AuthHelperService } from './auth-helper.service';

@Injectable()
export class AuthService {
  @InjectRepository(User)
  private readonly repository: Repository<User>;

  @Inject(AuthHelperService)
  private readonly helper: AuthHelperService;

  public async login(body: LoginDto): Promise<AuthUserResponseDto | null> {
    const { email, password }: LoginDto = body;
    const user: User = await this.repository.findOne({ where: { email } });
    if (!user) {
      throw new HttpException(
        'ユーザーが見つかりません。',
        HttpStatus.NOT_FOUND,
      );
    }

    const isPasswordValid: boolean = this.helper.isPasswordValid(
      password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new HttpException(
        'パスワードが正しくありません。',
        HttpStatus.NOT_FOUND,
      );
    }

    this.repository.update(user.id, { lastLoginAt: new Date() });

    /**
     * using classToPlain is important to exclude password from the response.
     */
    const resUser: AuthUserResponseDto = <AuthUserResponseDto>(
      classToPlain(user)
    );
    resUser.authToken = this.helper.generateToken(user);

    return resUser;
  }
}
