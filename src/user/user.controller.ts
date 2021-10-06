import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import User from 'src/entities/User';
import { ILogin } from 'src/interface/ILogin';
import GetUserRes from 'src/lib/response/user/GetUserRes';
import LoginResponse, { RegisterResponse } from 'src/lib/response/user/LoginResponse';
import { ResToken } from 'src/lib/response/user/ResponseData';
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
  @ApiOkResponse({ description: "회원가입 성공", type: RegisterResponse })
  @ApiUnauthorizedResponse({ description: '이미 존재하는 아이디' })
  async Register(@Body() registerDto: RegisterDto) {
    const token: ResToken = await this.userService.register(registerDto);

    return new RegisterResponse(200, "회원가입 성공", token);
  }

  @Post('/login')
  @HttpCode(200)
  @ApiOperation({ summary: '로그인' })
  @ApiOkResponse({ description: '로그인 성공', type: LoginResponse })
  @ApiNotFoundResponse({ description: '사용자 정보가 없음' })
  async Login(@Body() loginDto: LoginDto) {
    const data: ILogin = await this.userService.login(loginDto);

    return new LoginResponse(200, "로그인 성공", data);
  }

  @Get('/')
  @HttpCode(200)
  @ApiOperation({ summary: '나의 정보 조회' })
  @ApiBearerAuth('authorization')
  @UseGuards(new AuthGuard())
  @ApiOkResponse({ description: '유저 정보 조회 성공', type: GetUserRes })
  async getMyInfo(@Token() user: User) {
    const data: User = await this.userService.getMyInfo(user.phone);

    return new GetUserRes(200, "유저 조회 성공", data);
  }
}
