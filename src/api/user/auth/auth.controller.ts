import { LoginDto, AuthUserResponseDto } from './auth.dto';
import { JwtAuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { Request } from 'express';
import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';

@Controller('auth')
export class AuthController {
  @Inject(AuthService)
  private readonly service: AuthService;

  @Post('login')
  private login(@Body() body: LoginDto): Promise<AuthUserResponseDto | null> {
    return this.service.login(body);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  private getAuthUser(@Req() { user }: Request) {
    return user;
  }
}
