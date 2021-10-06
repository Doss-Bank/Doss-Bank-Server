import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import User from 'src/entities/User';
import BaseResponse from 'src/lib/response/BaseResponse';
import IsHavePwRes from 'src/lib/response/password/IsHavePwRes';
import LoginRes from 'src/lib/response/password/LoginResponse';
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
  @ApiBearerAuth('authorizatoin')
  @ApiOkResponse({ description: "비번 생성 성공", type: BaseResponse })
  @ApiUnauthorizedResponse({ description: '간편인증번호는 1회만 생성이 가능합니다' })
  async makePassword(@Token() user: User, @Body() passwordDto: PasswordDto) {
    await this.passwordService.makePassword(user, passwordDto);

    return new BaseResponse(200, "비번 생성 성공");
  }

  @Get('/')
  @HttpCode(200)
  @UseGuards(new AuthGuard())
  @ApiOkResponse({ description: '비번 조회 성공', type: IsHavePwRes })
  @ApiBearerAuth('authorization')
  async isHavePassword(@Token() user: User) {
    const isHave: boolean = await this.passwordService.isHavePW(user);

    return new IsHavePwRes(200, "비번 조회 성공", { isHave });
  }

  @Post('/login')
  @HttpCode(200)
  @ApiOkResponse({ description: '로그인 성공', type: LoginRes })
  @ApiUnauthorizedResponse({ description: '존재하지 않는 유저 정보' })
  async loginInSimplePassword(
    @Body() passwordDto: PasswordLoginDto,
  ) {
    const token: string = await this.passwordService.login(passwordDto);

    return new LoginRes(200, "로그인 성공", { token })
  }
}
