import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import User from 'src/entities/User';
import { Token } from 'src/lib/token';
import { AuthGuard } from 'src/middleware/authMiddleware';
import PasswordLoginDto from './dto/loginDto';
import PasswordDto from './dto/passwordDto';
import { PasswordService } from './password.service';

@Controller('password')
@ApiTags('password')
export class PasswordController {
  constructor(private passwordService: PasswordService) { }

  @Post('/')
  @HttpCode(200)
  @UseGuards(new AuthGuard())
  async makePassword(@Token() user: User, @Body() passwordDto: PasswordDto) {
    await this.passwordService.makePassword(user, passwordDto);

    return {
      status: 200,
      message: '비번 생성 성공',
    };
  }

  @Get('/')
  @HttpCode(200)
  @UseGuards(new AuthGuard())
  async isHavePassword(@Token() user: User) {
    const isHave: boolean = await this.passwordService.isHavePW(user);

    return {
      isHave,
      status: 200,
      message: '비번 조회 성공',
    };
  }

  @Post('/login')
  @HttpCode(200)
  async loginInSimplePassword(
    @Body() passwordDto: PasswordLoginDto,
  ) {
    const token: string = await this.passwordService.login(passwordDto);

    return {
      token,
      status: 200,
      mesage: '로그인 성공',
    };
  }
}
