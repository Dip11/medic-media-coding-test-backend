import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@/database/entities/user.entity';
import { AuthHelperService } from './auth/auth-helper.service';
@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UserController],
  providers: [UserService, AuthHelperService],
})
export class UserModule {}
