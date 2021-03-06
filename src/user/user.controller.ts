import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBasicAuth,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import User from 'src/entities/User';
import { ILogin } from 'src/interface/ILogin';
import GetUserRes from 'src/lib/response/user/GetUserRes';
import LoginResponse, {
  CheckResponse,
  RegisterResponse,
} from 'src/lib/response/user/LoginResponse';
import { ResToken } from 'src/lib/response/user/ResponseData';
import { Token } from 'src/lib/token';
import { AuthGuard } from 'src/middleware/authMiddleware';
import LoginDto from './dto/loginDto';
import RegisterDto from './dto/registerDto';
import { UserService } from './user.service';

@Controller('user')
@ApiTags('User')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('/register')
  @HttpCode(200)
  @ApiOperation({ summary: '회원가입' })
  @ApiOkResponse({ description: '회원가입 성공', type: RegisterResponse })
  @ApiUnauthorizedResponse({ description: '이미 존재하는 아이디' })
  async Register(@Body() registerDto: RegisterDto) {
    const token: ResToken = await this.userService.register(registerDto);

    return new RegisterResponse(200, '회원가입 성공', token);
  }

  @Post('/login')
  @HttpCode(200)
  @ApiOperation({ summary: '로그인' })
  @ApiOkResponse({ description: '로그인 성공', type: LoginResponse })
  @ApiNotFoundResponse({ description: '사용자 정보가 없음' })
  async Login(@Body() loginDto: LoginDto) {
    const data: ILogin = await this.userService.login(loginDto);

    return new LoginResponse(200, '로그인 성공', data);
  }

  @Get('/')
  @HttpCode(200)
  @ApiOperation({ summary: '나의 정보 조회' })
  @ApiBasicAuth('authorization')
  @UseGuards(new AuthGuard())
  @ApiOkResponse({ description: '유저 정보 조회 성공', type: GetUserRes })
  async getMyInfo(@Token() user: User) {
    const data: User = await this.userService.getMyInfo(user.phone);

    return new GetUserRes(200, '유저 조회 성공', data);
  }

  @Get('/get')
  @HttpCode(200)
  @ApiOkResponse({ description: '유저 조회 성공', type: GetUserRes })
  @ApiNotFoundResponse({ description: '존재하지 않는 유저' })
  async getMyInfoByNameAndBirth(
    @Query('name') name: string,
    @Query('birth') birth: string,
  ) {
    const data: User = await this.userService.getMyInfoByNameAndBirth(
      name,
      birth,
    );

    return new GetUserRes(200, '유저 조회 성공', data);
  }

  @Get('/check-id')
  @HttpCode(200)
  @ApiOkResponse({ description: '아이디 중복 조회 성공', type: CheckResponse })
  async checkId(@Query('id') id: string) {
    const check: boolean = await this.userService.checkId(id);

    return new CheckResponse(200, '중복 조회 성공', check);
  }

  @Get('/check-nick')
  @HttpCode(200)
  @ApiOkResponse({ description: '닉네임 중복 조호 성공', type: CheckResponse })
  async checkNick(@Query('nick') nick: string) {
    const check: boolean = await this.userService.checkNick(nick);

    return new CheckResponse(200, '닉네임 중복 조회 성공', check);
  }
}
