import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import User from 'src/entities/User';
import { ILogin } from 'src/interface/ILogin';
import BaseResponse from 'src/lib/response/BaseResponse';
import LoginResponse from 'src/lib/response/user/LoginResponse';
import { Token } from 'src/lib/token';
import { AuthGuard } from 'src/middleware/authMiddleware';
import LoginDto from './dto/loginDto';
import RegisterDto from './dto/registerDto';
import { UserService } from './user.service';

@Controller('user')
@ApiTags('User')
export class UserController {
  constructor(private userService: UserService) { }

  @Post('/register')
  @HttpCode(200)
  @ApiOperation({ summary: '회원가입' })
  @ApiOkResponse({ description: "회원가입 성공", type: BaseResponse })
  @ApiUnauthorizedResponse({ description: '이미 존재하는 계정' })
  async Register(@Body() registerDto: RegisterDto) {
    await this.userService.register(registerDto);

    return {
      status: 200,
      messgae: '회원가입 성공',
    };
  }

  @Post('/login')
  @HttpCode(200)
  @ApiOperation({ summary: '로그인' })
  @ApiOkResponse({ description: '로그인 성공', type: LoginResponse })
  async Login(@Body() loginDto: LoginDto) {
    const data: ILogin = await this.userService.login(loginDto);

    return {
      data,
      status: 200,
      message: '로그인 성공',
    };
  }

  @Get('/')
  @HttpCode(200)
  @ApiOperation({ summary: '나의 정보 조회' })
  @ApiBearerAuth('authorization')
  @UseGuards(new AuthGuard())
  async getMyInfo(@Token() user: User) {
    const data: User = await this.userService.getMyInfo(user.phone);

    return {
      status: 200,
      message: '조회 성공',
      data: data
    }
  }
}
